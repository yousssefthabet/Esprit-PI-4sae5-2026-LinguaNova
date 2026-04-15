import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { StudentStats, InstructorStats, RecentActivity, ClassSchedule } from '../models/dashboard.model';
import { API_ENDPOINTS } from '../constants/app.constants';
import { MockDataService } from './mock-data.service';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private readonly http = inject(HttpClient);
    private readonly mockData = inject(MockDataService);

    /**
     * Get student dashboard statistics
     */
    getStudentStats(): Observable<StudentStats> {
        return of({
            enrolledCourses: 12,
            completedCourses: 8,
            totalLearningTime: 156,
            certificatesEarned: 5,
            points: 1250
        }).pipe(delay(500));
    }

    /**
     * Get instructor dashboard statistics
     */
    getInstructorStats(): Observable<InstructorStats> {
        return of({
            activeCourses: 5,
            totalStudents: 12500,
            totalEarnings: 45000,
            averageRating: 4.8
        }).pipe(delay(500));
    }

    /**
     * Get recent activity feed
     */
    getRecentActivity(): Observable<RecentActivity[]> {
        return of([
            {
                id: '1',
                type: 'course_completed',
                description: 'You completed "Complete Web Design"',
                timestamp: new Date()
            },
            {
                id: '2',
                type: 'lesson_completed',
                description: 'You finished Lesson 4 of React Patterns',
                timestamp: new Date(Date.now() - 3600000)
            },
            {
                id: '3',
                type: 'certificate_earned',
                description: 'You earned a certificate in UI/UX Design',
                timestamp: new Date(Date.now() - 86400000)
            }
        ]).pipe(delay(500));
    }

    /**
     * Get upcoming classes schedule
     */
    getUpcomingClasses(): Observable<ClassSchedule[]> {
        return of([
            {
                id: '1',
                courseId: '1',
                courseName: 'Complete Web Design',
                instructorName: 'Sarah Drasner',
                startTime: new Date(2026, 1, 17, 10, 0), // Feb 17
                endTime: new Date(2026, 1, 17, 12, 0),
                meetingUrl: 'https://zoom.us/j/demo',
                status: 'live' as 'upcoming' | 'live' | 'ended',
                progress: 60,
                currentLesson: 'Lesson 5 of 7'
            },
            {
                id: '2',
                courseId: '2',
                courseName: 'Advanced React Patterns',
                instructorName: 'Kent C. Dodds',
                startTime: new Date(2026, 1, 18, 14, 0), // Feb 18
                endTime: new Date(2026, 1, 18, 16, 0),
                meetingUrl: 'https://zoom.us/j/demo',
                status: 'upcoming' as 'upcoming' | 'live' | 'ended',
                progress: 30,
                currentLesson: 'Lesson 2 of 10'
            }
        ]).pipe(delay(500));
    }
}
