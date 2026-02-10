import { Injectable, UnauthorizedException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  RegisterRequest,
  LoginRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  DevResetPasswordRequest,
} from '@itinavi/schema';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterRequest) {
    // Check if username already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Check if email already exists (if provided)
    if (dto.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        passwordHash,
        displayName: dto.displayName,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.username);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        userType: user.userType,
      },
      ...tokens,
    };
  }

  async login(dto: LoginRequest) {
    // Find user by username
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.username);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        userType: user.userType,
      },
      ...tokens,
    };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        userType: true,
        avatar: true,
      },
    });

    return user;
  }

  private async generateTokens(userId: string, username: string) {
    const payload = { sub: userId, username };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
    });

    return {
      accessToken,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileRequest) {
    // Check if email is being updated and already exists
    if (dto.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingEmail && existingEmail.id !== userId) {
        throw new ConflictException('Email already exists');
      }
    }

    // Update user profile
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        displayName: dto.displayName,
        email: dto.email,
        avatar: dto.avatar,
      },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        userType: true,
        avatar: true,
      },
    });

    return user;
  }

  async changePassword(userId: string, dto: ChangePasswordRequest) {
    // Get user with password hash
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const passwordValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);

    if (!passwordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(dto.newPassword, 10);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    return { message: 'Password changed successfully' };
  }

  async getAllUsers(requestingUserId: string) {
    // Verify requesting user is a Dev
    const requestingUser = await this.prisma.user.findUnique({
      where: { id: requestingUserId },
    });

    if (!requestingUser || requestingUser.userType !== 'Dev') {
      throw new ForbiddenException('Only Dev users can access user list');
    }

    // Get all users
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        userType: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users;
  }

  async devResetPassword(requestingUserId: string, dto: DevResetPasswordRequest) {
    // Verify requesting user is a Dev
    const requestingUser = await this.prisma.user.findUnique({
      where: { id: requestingUserId },
    });

    if (!requestingUser || requestingUser.userType !== 'Dev') {
      throw new ForbiddenException('Only Dev users can reset passwords');
    }

    // Find target user
    const targetUser = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!targetUser) {
      throw new BadRequestException('User not found');
    }

    // Hash default password: "password"
    const defaultPasswordHash = await bcrypt.hash('password', 10);

    // Update user's password
    await this.prisma.user.update({
      where: { id: dto.userId },
      data: {
        passwordHash: defaultPasswordHash,
      },
    });

    return { 
      message: `Password reset successfully for ${targetUser.username}`,
      defaultPassword: 'password',
    };
  }
}
