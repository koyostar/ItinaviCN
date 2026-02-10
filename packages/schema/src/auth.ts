import { z } from "zod";

// ========================================
// Register & Login
// ========================================

export const RegisterRequestSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  email: z.string().email().optional(),
  displayName: z.string().optional(),
});

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

export const LoginRequestSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

// ========================================
// User Profile
// ========================================

export const UserTypeSchema = z.enum(["Dev", "User"]);

export type UserType = z.infer<typeof UserTypeSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  email: z.string().email().nullable(),
  displayName: z.string().nullable(),
  userType: UserTypeSchema,
  avatar: z.string().nullable().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const AuthResponseSchema = z.object({
  user: UserSchema,
  accessToken: z.string(),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// ========================================
// Profile Management
// ========================================

export const UpdateProfileRequestSchema = z.object({
  displayName: z.string().optional(),
  email: z.string().email().optional(),
  avatar: z.string().optional(),
});

export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;

export const ChangePasswordRequestSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>;

// ========================================
// Dev-only endpoints
// ========================================

export const DevResetPasswordRequestSchema = z.object({
  userId: z.string().uuid(),
});

export type DevResetPasswordRequest = z.infer<typeof DevResetPasswordRequestSchema>;
