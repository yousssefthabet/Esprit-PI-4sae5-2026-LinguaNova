import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError, of, delay } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { User, AuthResponse, LoginCredentials, RegisterData, UserRole } from '../models/user.model';
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants/app.constants';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);

    private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor() {
        // Check if token exists on init
        if (this.getToken()) {
            this.loadCurrentUser();
        }
    }

    /**
     * Login user with credentials
     */
    login(credentials: LoginCredentials): Observable<AuthResponse> {
        // For demo purposes, allow any login
        // If email contains 'instructor', give instructor role
        const email = credentials.email.toLowerCase();
        let role = UserRole.STUDENT;
        let id = '1';
        let firstName = 'Demo';
        let lastName = 'User';
        let avatar = 'https://i.pravatar.cc/150?u=demo';

        if (email.includes('admin')) {
            role = UserRole.ADMIN;
            id = 'admin-1';
            firstName = 'System';
            lastName = 'Admin';
            avatar = 'https://i.pravatar.cc/150?u=admin';
        } else if (email.includes('instructor')) {
            role = UserRole.INSTRUCTOR;
            id = 'ins-1';
            firstName = 'Sarah';
            lastName = 'Drasner';
            avatar = 'https://i.pravatar.cc/150?u=sarah';
        }

        const mockResponse: AuthResponse = {
            user: {
                id,
                email: credentials.email,
                firstName,
                lastName,
                role,
                avatar,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            token: 'mock-jwt-token',
            refreshToken: 'mock-refresh-token',
            expiresIn: 3600
        };

        return of(mockResponse).pipe(
            delay(800),
            tap(response => this.handleAuthSuccess(response))
        );
    }

    /**
     * Register new user
     */
    register(data: RegisterData): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data).pipe(
            tap(response => this.handleAuthSuccess(response)),
            catchError(this.handleError)
        );
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

        // Allow mock token for demo
        if (token === 'mock-jwt-token') return true;

        // Check if token is expired
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
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
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
        console.error('Auth error:', error);
        return throwError(() => error);
    }
}
