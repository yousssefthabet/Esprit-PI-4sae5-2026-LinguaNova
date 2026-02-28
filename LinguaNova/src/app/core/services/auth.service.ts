import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError, of, delay } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { User, AuthResponse, LoginCredentials, RegisterData, UserRole } from '../models/user.model';
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants/app.constants';

/** Backend auth response: { token, role } */
interface BackendAuthResponse {
    token: string;
    role: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);

    private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor() {
        if (this.getToken()) {
            this.loadCurrentUser();
        }
    }

    /**
     * Login user with credentials (calls user-service backend)
     */
    login(credentials: LoginCredentials): Observable<AuthResponse> {
        return this.http.post<BackendAuthResponse>(API_ENDPOINTS.AUTH.LOGIN, {
            email: credentials.email.trim(),
            password: credentials.password
        }).pipe(
            map(res => this.toAuthResponse(res, credentials.email)),
            tap(response => this.handleAuthSuccess(response)),
            catchError(this.handleError)
        );
    }

    /**
     * Register new user (calls user-service backend - student or teacher)
     */
    register(data: RegisterData): Observable<AuthResponse> {
        const isStudent = data.role === UserRole.STUDENT;
        const url = isStudent ? API_ENDPOINTS.AUTH.REGISTER_STUDENT : API_ENDPOINTS.AUTH.REGISTER_TEACHER;
        const payload = isStudent ? this.buildStudentPayload(data) : this.buildTeacherPayload(data);

        return this.http.post<BackendAuthResponse>(url, payload).pipe(
            map(res => this.toAuthResponse(res, data.email)),
            tap(response => this.handleAuthSuccess(response)),
            catchError(this.handleError)
        );
    }

    private buildStudentPayload(data: RegisterData): { email: string; username: string; password: string } {
        const email = (data.email ?? '').toString().trim();
        const username = ((data as any).username ?? data.firstName ?? (data.email && data.email.split('@')[0]) ?? '').toString().trim() || email.split('@')[0] || 'user';
        const password = (data.password ?? '').toString();
        return { email, username, password };
    }

    private buildTeacherPayload(data: RegisterData): Record<string, unknown> {
        const d = data as any;
        return {
            email: data.email.trim(),
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: d.phoneNumber || undefined,
            dateOfBirth: d.dateOfBirth ? (typeof d.dateOfBirth === 'string' ? d.dateOfBirth : (d.dateOfBirth as Date).toISOString().split('T')[0]) : undefined,
            teachingExperience: d.teachingExperience != null ? String(d.teachingExperience) : undefined,
            highestEducation: d.educationLevel || d.highestEducation || undefined,
            certificationNumber: d.certificationNumber || undefined,
            subjectSpecializations: Array.isArray(d.subjectSpecializations) ? d.subjectSpecializations.join(', ') : (d.subjectSpecializations || undefined),
            gradeLevelsTaught: Array.isArray(d.gradeLevels) ? d.gradeLevels.join(', ') : undefined,
            profilePhoto: d.profilePhoto || undefined,
            password: data.password
        };
    }

    private toAuthResponse(res: BackendAuthResponse, email: string): AuthResponse {
        const role = res.role === 'TEACHER' ? UserRole.INSTRUCTOR : (res.role === 'ADMIN' ? UserRole.ADMIN : UserRole.STUDENT);
        const user: User = {
            id: this.decodeUserIdFromToken(res.token) ?? '0',
            email,
            firstName: '',
            lastName: '',
            role,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        return {
            user,
            token: res.token,
            refreshToken: '',
            expiresIn: 3600
        };
    }

    private decodeUserIdFromToken(token: string): string | null {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.sub ?? payload.userId ?? null;
        } catch {
            return null;
        }
    }

    /**
     * Logout user (local only; no server call to avoid 500 when auth backend is not running)
     */
    logout(): void {
        // Clear storage
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);

        // Clear current user
        this.currentUserSubject.next(null);

        // Navigate to login
        this.router.navigate(['/auth/login']);
    }

    /**
     * Refresh access token
     */
    refreshToken(): Observable<string> {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

        return this.http.post<{ token: string }>(
            API_ENDPOINTS.AUTH.REFRESH_TOKEN,
            { refreshToken }
        ).pipe(
            tap(response => {
                localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.token);
            }),
            map(response => response.token),
            catchError(error => {
                this.logout();
                return throwError(() => error);
            })
        );
    }

    /**
     * Get current user from API
     */
    getCurrentUser(): Observable<User> {
        const storedUser = this.getUserFromStorage();
        if (storedUser) return of(storedUser);

        return of({
            id: '1',
            email: 'demo@example.com',
            firstName: 'Demo',
            lastName: 'User',
            role: UserRole.STUDENT,
            avatar: 'https://i.pravatar.cc/150?u=demo',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        } as User).pipe(
            tap(user => {
                this.currentUserSubject.next(user);
                this.saveUserToStorage(user);
            })
        );
    }

    /**
     * Update user profile
     */
    updateUser(user: User): Observable<User> {
        // In a real app, this would be an HTTP PUT/PATCH request
        // return this.http.put<User>(`${API_ENDPOINTS.USERS}/${user.id}`, user).pipe(...)

        return of(user).pipe(
            delay(500),
            tap(updatedUser => {
                this.currentUserSubject.next(updatedUser);
                this.saveUserToStorage(updatedUser);
            })
        );
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    }

    /**
     * Get stored auth token
     */
    getToken(): string | null {
        return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    }

    /**
     * Get current user value (synchronous)
     */
    get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    // Private helper methods

    private handleAuthSuccess(response: AuthResponse): void {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.token);
        if (response.refreshToken) {
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
        }
        this.saveUserToStorage(response.user);
        this.currentUserSubject.next(response.user);
    }

    private loadCurrentUser(): void {
        this.getCurrentUser().subscribe({
            error: () => this.logout()
        });
    }

    private getUserFromStorage(): User | null {
        const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        return userData ? JSON.parse(userData) : null;
    }

    private saveUserToStorage(user: User): void {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    }

    private handleError(error: any): Observable<never> {
        console.error('Auth error:', error?.status, error?.statusText, error?.url);
        if (error?.error && typeof error.error === 'object') {
            console.error('Backend response body:', error.error);
        }
        return throwError(() => error);
    }
}
