"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevResetPasswordRequestSchema = exports.ChangePasswordRequestSchema = exports.UpdateProfileRequestSchema = exports.AuthResponseSchema = exports.UserSchema = exports.UserTypeSchema = exports.LoginRequestSchema = exports.RegisterRequestSchema = void 0;
const zod_1 = require("zod");
// ========================================
// Register & Login
// ========================================
exports.RegisterRequestSchema = zod_1.z.object({
    username: zod_1.z.string().min(3),
    password: zod_1.z.string().min(6),
    email: zod_1.z.string().email().optional(),
    displayName: zod_1.z.string().optional(),
});
exports.LoginRequestSchema = zod_1.z.object({
    username: zod_1.z.string().min(1),
    password: zod_1.z.string().min(1),
});
// ========================================
// User Profile
// ========================================
exports.UserTypeSchema = zod_1.z.enum(["Dev", "User"]);
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    username: zod_1.z.string(),
    email: zod_1.z.string().email().nullable(),
    displayName: zod_1.z.string().nullable(),
    userType: exports.UserTypeSchema,
    avatar: zod_1.z.string().nullable().optional(),
});
exports.AuthResponseSchema = zod_1.z.object({
    user: exports.UserSchema,
    accessToken: zod_1.z.string(),
});
// ========================================
// Profile Management
// ========================================
exports.UpdateProfileRequestSchema = zod_1.z.object({
    displayName: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    avatar: zod_1.z.string().optional(),
});
exports.ChangePasswordRequestSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1),
    newPassword: zod_1.z.string().min(6),
});
// ========================================
// Dev-only endpoints
// ========================================
exports.DevResetPasswordRequestSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
});
