import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { Course, CourseFilters, EnrollmentResponse, CourseProgress } from '../models/course.model';
import { API_ENDPOINTS } from '../constants/app.constants';
import { PaginatedResponse } from '../models/common.model';
import { MockDataService } from './mock-data.service';

@Injectable({
    providedIn: 'root'
})
export class CourseService {
    private readonly http = inject(HttpClient);
    private readonly mockData = inject(MockDataService);

    /**
     * Get all courses with optional filters
     */
    getCourses(filters?: CourseFilters): Observable<PaginatedResponse<Course>> {
        // For demo purposes, we return mock data
        return of({
            items: this.mockData.courses,
            pagination: {
                currentPage: 1,
                totalPages: 1,
                totalItems: this.mockData.courses.length,
                itemsPerPage: 10,
                hasNext: false,
                hasPrevious: false
            }
        }).pipe(delay(500));
    }

    /**
     * Get course by ID
     */
    getCourseById(id: string): Observable<Course> {
        const course = this.mockData.courses.find(c => c.id === id);
        if (course) {
            return of(course).pipe(delay(300));
        }
        return this.http.get<Course>(API_ENDPOINTS.COURSES.DETAIL(id));
    }

    /**
     * Enroll in a course
     */
    enrollCourse(courseId: string): Observable<EnrollmentResponse> {
        return this.http.post<EnrollmentResponse>(
            API_ENDPOINTS.COURSES.ENROLL(courseId),
            {}
        );
    }

    /**
     * Get enrolled courses for current user
     */
    getEnrolledCourses(): Observable<Course[]> {
        // Return 3 mock enrolled courses with different progress for demo
        const enrolled = this.mockData.courses.slice(0, 3).map((course, index) => ({
            ...course,
            progress: [75, 45, 12][index]
        }));
        return of(enrolled).pipe(delay(600));
    }

    /**
     * Search courses
     */
    searchCourses(query: string): Observable<Course[]> {
        const params = new HttpParams().set('q', query);
        return this.http.get<Course[]>(API_ENDPOINTS.COURSES.SEARCH, { params });
    }

    /**
     * Get course progress
     */
    getCourseProgress(courseId: string): Observable<CourseProgress> {
        return this.http.get<CourseProgress>(API_ENDPOINTS.COURSES.PROGRESS(courseId));
    }

    /**
     * Update course progress
     */
    updateProgress(courseId: string, lessonId: string): Observable<CourseProgress> {
        return this.http.post<CourseProgress>(
            API_ENDPOINTS.COURSES.PROGRESS(courseId),
            { lessonId, completed: true }
        );
    }
}
