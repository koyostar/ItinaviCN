import { Controller, Post, Body, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterRequestSchema,
  LoginRequestSchema,
  UpdateProfileRequestSchema,
  ChangePasswordRequestSchema,
  DevResetPasswordRequestSchema,
} from '@itinavi/schema';
import { validate } from '../../common/validate';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() body: unknown) {
    const input = validate(RegisterRequestSchema, body);
    return this.authService.register(input);
  }

  @Public()
  @Post('login')
  async login(@Body() body: unknown) {
    const input = validate(LoginRequestSchema, body);
    return this.authService.login(input);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@CurrentUser() user: any) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() body: unknown,
  ) {
    const input = validate(UpdateProfileRequestSchema, body);
    return this.authService.updateProfile(user.id, input);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @CurrentUser() user: any,
    @Body() body: unknown,
  ) {
    const input = validate(ChangePasswordRequestSchema, body);
    return this.authService.changePassword(user.id, input);
  }

  // Dev-only endpoints
  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getAllUsers(@CurrentUser() user: any) {
    return this.authService.getAllUsers(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('dev-reset-password')
  async devResetPassword(
    @CurrentUser() user: any,
    @Body() body: unknown,
  ) {
    const input = validate(DevResetPasswordRequestSchema, body);
    return this.authService.devResetPassword(user.id, input);
  }
}
