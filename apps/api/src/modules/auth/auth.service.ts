import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
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

  async login(dto: LoginDto) {
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
}
