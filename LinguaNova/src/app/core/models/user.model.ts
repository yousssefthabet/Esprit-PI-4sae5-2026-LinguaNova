// ============================================
// User Model & Auth Types
// ============================================

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    avatar?: string;
    bio?: string;
    enrolledCourses?: string[]; // Course IDs
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    // Instructor specific fields
    phoneNumber?: string;
    dateOfBirth?: Date;
    educationLevel?: string;
    certificationNumber?: string;
    teachingExperience?: number;
    subjectSpecializations?: string[];
    gradeLevels?: string[];
    address?: string;
}

export enum UserRole {
    STUDENT = 'student',
    INSTRUCTOR = 'instructor',
    ADMIN = 'admin'
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken: string;
    expiresIn: number;
}

export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterData {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    agreeToTerms: boolean;
    // Instructor specific fields
    phoneNumber?: string;
    dateOfBirth?: Date;
    educationLevel?: string;
    certificationNumber?: string;
    teachingExperience?: number;
    subjectSpecializations?: string[];
    gradeLevels?: string[];
    profilePhoto?: string; // URL or base64 placeholder for now
    address?: string; // Might be useful later
}

export interface TokenPayload {
    userId: string;
    email: string;
    role: UserRole;
    iat: number;
    exp: number;
}

export interface PasswordResetRequest {
    email: string;
}

export interface PasswordReset {
    token: string;
    newPassword: string;
    confirmPassword: string;
}
