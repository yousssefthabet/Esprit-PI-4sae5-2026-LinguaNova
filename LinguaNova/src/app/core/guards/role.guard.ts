import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const requiredRole = route.data['role'] as UserRole;
    const currentUser = authService.currentUserValue;

    if (!currentUser) {
        router.navigate(['/auth/login']);
        return false;
    }

    if (requiredRole && currentUser.role !== requiredRole) {
        // User doesn't have required role, redirect to appropriate dashboard
        if (currentUser.role === UserRole.STUDENT) {
            router.navigate(['/dashboard/student']);
        } else if (currentUser.role === UserRole.INSTRUCTOR) {
            router.navigate(['/dashboard/instructor']);
        } else if (currentUser.role === UserRole.ADMIN) {
            router.navigate(['/admin/dashboard']);
        } else {
            router.navigate(['/']);
        }
        return false;
    }

    return true;
};
