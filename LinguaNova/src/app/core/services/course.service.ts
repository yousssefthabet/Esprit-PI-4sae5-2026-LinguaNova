import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Course, CourseFilters, CreateCoursePayload, EnrollmentResponse } from '../models/course.model';
import { API_CONFIG } from '../constants/app.constants';
import { PaginatedResponse } from '../models/common.model';

@Injectable({
    providedIn: 'root'
})
export class CourseService {
    private readonly http = inject(HttpClient);

    // Base URL pointing to the Spring Boot course microservice
    private readonly baseUrl = `${API_CONFIG.COURSE_SERVICE_URL}/courses`;

    /**
     * Get all courses with optional filters (paginated)
     * GET /PIproject/api/courses
     */
    getCourses(filters?: CourseFilters): Observable<PaginatedResponse<Course>> {
        let params = new HttpParams();
        if (filters?.page) params = params.set('page', filters.page.toString());
        if (filters?.limit) params = params.set('limit', filters.limit.toString());
        if (filters?.sortBy) params = params.set('sortBy', filters.sortBy);

        return this.http.get<PaginatedResponse<Course>>(this.baseUrl, { params }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Get course by ID
     * GET /PIproject/api/courses/{id}
     */
    getCourseById(id: string): Observable<Course> {
        return this.http.get<Course>(`${this.baseUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Get courses created by the current instructor
     * GET /PIproject/api/courses/instructor
     */
    getInstructorCourses(): Observable<Course[]> {
        return this.http.get<Course[]>(`${this.baseUrl}/instructor`).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Search courses by keyword
     * GET /PIproject/api/courses/search?q=...
     */
    searchCourses(query: string): Observable<Course[]> {
        const params = new HttpParams().set('q', query);
        return this.http.get<Course[]>(`${this.baseUrl}/search`, { params }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Create a new course (Instructor only). Sends payload to backend; backend saves to database PI.
     * POST /PIproject/api/courses
     */
    createCourse(payload: CreateCoursePayload): Observable<Course> {
        return this.http.post<Course>(this.baseUrl, payload).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Update an existing course (Instructor only).
     * PUT /PIproject/api/courses/{id}
     */
    updateCourse(id: string, payload: CreateCoursePayload): Observable<Course> {
        return this.http.put<Course>(`${this.baseUrl}/${id}`, payload).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Delete a course (Instructor only)
     * DELETE /PIproject/api/courses/{id}
     */
    deleteCourse(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Get enrolled courses for current student
     * GET /PIproject/api/courses/enrolled
     */
    getEnrolledCourses(): Observable<Course[]> {
        return this.http.get<Course[]>(`${this.baseUrl}/enrolled`).pipe(
            map(items => Array.isArray(items) ? items : []),
            catchError(this.handleError)
        );
    }

    /**
     * Enroll in a course (after Stripe payment or direct when Stripe not configured)
     * POST /PIproject/api/courses/{id}/enroll
     */
    enrollCourse(courseId: string, stripeSessionId?: string): Observable<EnrollmentResponse> {
        const body = stripeSessionId ? { stripeSessionId } : {};
        return this.http.post<EnrollmentResponse>(`${this.baseUrl}/${courseId}/enroll`, body).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Create Stripe Checkout Session for course purchase. Returns redirect URL.
     * POST /PIproject/api/courses/{id}/create-checkout-session
     */
    createCheckoutSession(courseId: string, successUrl: string, cancelUrl: string): Observable<{ url: string }> {
        return this.http.post<{ url: string }>(`${this.baseUrl}/${courseId}/create-checkout-session`, {
            successUrl,
            cancelUrl
        }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Update course progress (0-100). Used when viewing a lesson so my-courses cards show correct progress.
     * POST /PIproject/api/courses/{courseId}/progress
     */
    updateProgressPercent(courseId: string, progress: number): Observable<{ progress: number }> {
        return this.http.post<{ progress: number }>(`${this.baseUrl}/${courseId}/progress`, { progress }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Upload a lesson file (PDF or video). Returns { fileUrl, fileName } to store in the lesson.
     * POST /PIproject/api/courses/upload-lesson-file
     */
    uploadLessonFile(file: File): Observable<{ fileUrl: string; fileName: string }> {
        const formData = new FormData();
        formData.append('file', file, file.name);
        return this.http.post<{ fileUrl: string; fileName: string }>(`${this.baseUrl}/upload-lesson-file`, formData).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: any): Observable<never> {
        console.error('CourseService error:', error);
        return throwError(() => error);
    }
}
