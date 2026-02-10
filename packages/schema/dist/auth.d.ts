import { z } from "zod";
export declare const RegisterRequestSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    displayName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
    email?: string | undefined;
    displayName?: string | undefined;
}, {
    username: string;
    password: string;
    email?: string | undefined;
    displayName?: string | undefined;
}>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export declare const LoginRequestSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
}, {
    username: string;
    password: string;
}>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export declare const UserTypeSchema: z.ZodEnum<["Dev", "User"]>;
export type UserType = z.infer<typeof UserTypeSchema>;
export declare const UserSchema: z.ZodObject<{
    id: z.ZodString;
    username: z.ZodString;
    email: z.ZodNullable<z.ZodString>;
    displayName: z.ZodNullable<z.ZodString>;
    userType: z.ZodEnum<["Dev", "User"]>;
    avatar: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    username: string;
    email: string | null;
    displayName: string | null;
    id: string;
    userType: "Dev" | "User";
    avatar?: string | null | undefined;
}, {
    username: string;
    email: string | null;
    displayName: string | null;
    id: string;
    userType: "Dev" | "User";
    avatar?: string | null | undefined;
}>;
export type User = z.infer<typeof UserSchema>;
export declare const AuthResponseSchema: z.ZodObject<{
    user: z.ZodObject<{
        id: z.ZodString;
        username: z.ZodString;
        email: z.ZodNullable<z.ZodString>;
        displayName: z.ZodNullable<z.ZodString>;
        userType: z.ZodEnum<["Dev", "User"]>;
        avatar: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        username: string;
        email: string | null;
        displayName: string | null;
        id: string;
        userType: "Dev" | "User";
        avatar?: string | null | undefined;
    }, {
        username: string;
        email: string | null;
        displayName: string | null;
        id: string;
        userType: "Dev" | "User";
        avatar?: string | null | undefined;
    }>;
    accessToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user: {
        username: string;
        email: string | null;
        displayName: string | null;
        id: string;
        userType: "Dev" | "User";
        avatar?: string | null | undefined;
    };
    accessToken: string;
}, {
    user: {
        username: string;
        email: string | null;
        displayName: string | null;
        id: string;
        userType: "Dev" | "User";
        avatar?: string | null | undefined;
    };
    accessToken: string;
}>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export declare const UpdateProfileRequestSchema: z.ZodObject<{
    displayName: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    displayName?: string | undefined;
    avatar?: string | undefined;
}, {
    email?: string | undefined;
    displayName?: string | undefined;
    avatar?: string | undefined;
}>;
export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;
export declare const ChangePasswordRequestSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currentPassword: string;
    newPassword: string;
}, {
    currentPassword: string;
    newPassword: string;
}>;
export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>;
export declare const DevResetPasswordRequestSchema: z.ZodObject<{
    userId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userId: string;
}, {
    userId: string;
}>;
export type DevResetPasswordRequest = z.infer<typeof DevResetPasswordRequestSchema>;
