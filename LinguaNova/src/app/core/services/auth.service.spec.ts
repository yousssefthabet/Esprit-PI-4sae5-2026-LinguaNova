import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { STORAGE_KEYS } from '../constants/app.constants';
import { UserRole } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    localStorage.clear();
    router = { navigate: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: router }
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('logs in, maps TEACHER to instructor, and stores auth data', () => {
    service.login({ email: ' teacher@example.com ', password: 'secret123' }).subscribe((response) => {
      expect(response.user.email).toBe(' teacher@example.com ');
      expect(response.user.role).toBe(UserRole.INSTRUCTOR);
      expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBe('token');
    });

    const loginReq = httpMock.expectOne('/PIproject/api/auth/login');
    expect(loginReq.request.method).toBe('POST');
    expect(loginReq.request.body).toEqual({ email: 'teacher@example.com', password: 'secret123' });
    loginReq.flush({ token: 'token', role: 'TEACHER', userId: 4 });

    const meReq = httpMock.expectOne('/PIproject/api/auth/me');
    meReq.flush({
      id: 4,
      email: 'teacher@example.com',
      role: 'TEACHER',
      firstName: 'Amina',
      lastName: 'Ben Ali'
    });
  });

  it('registers students against the student backend endpoint', () => {
    service.register({
      email: 'student@example.com',
      password: 'secret123',
      confirmPassword: 'secret123',
      firstName: 'Student',
      lastName: 'One',
      role: UserRole.STUDENT,
      agreeToTerms: true
    }).subscribe((response) => {
      expect(response.user.role).toBe(UserRole.STUDENT);
    });

    const registerReq = httpMock.expectOne('/PIproject/api/auth/register/student');
    expect(registerReq.request.method).toBe('POST');
    expect(registerReq.request.body).toEqual({
      email: 'student@example.com',
      username: 'Student',
      password: 'secret123'
    });
    registerReq.flush({ token: 'student-token', role: 'STUDENT', userId: 9 });

    const meReq = httpMock.expectOne('/PIproject/api/auth/me');
    meReq.flush({ id: 9, email: 'student@example.com', role: 'STUDENT' });
  });

  it('logs out locally and navigates to login', () => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'token');
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, 'refresh');

    service.logout();

    expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });
});
