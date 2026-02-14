import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, map } from 'rxjs';
import { User, UserRole } from '../models/user.model';
import { Feedback } from '../models/feedback.model';

export interface AdminStats {
    totalUsers: number;
    totalInstructors: number;
    activeCourses: number;
    totalRevenue: number;
    monthlyGrowth: number;
    newUsersToday: number;
}

export interface Club {
    id: string;
    title: string;
    description: string;
    category: string;
    memberCount: number;
    image: string;
    icon: string;
    instructorName: string;
    status: 'active' | 'archived';
}

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private readonly http = inject(HttpClient);

    /**
     * Get admin dashboard statistics
     */
    getStats(): Observable<AdminStats> {
        return of({
            totalUsers: 15420,
            totalInstructors: 425,
            activeCourses: 124,
            totalRevenue: 85400,
            monthlyGrowth: 12.5,
            newUsersToday: 48
        }).pipe(delay(600));
    }

    /**
     * Get all users (students and instructors)
     */
    getUsers(): Observable<User[]> {
        const mockUsers: User[] = [
            {
                id: '1',
                email: 'john@example.com',
                firstName: 'John',
                lastName: 'Doe',
                role: UserRole.STUDENT,
                isActive: true,
                createdAt: new Date('2023-01-15'),
                updatedAt: new Date()
            },
            {
                id: '2',
                email: 'sarah.d@example.com',
                firstName: 'Sarah',
                lastName: 'Drasner',
                role: UserRole.INSTRUCTOR,
                isActive: true,
                createdAt: new Date('2023-02-10'),
                updatedAt: new Date()
            },
            {
                id: '3',
                email: 'mike.r@example.com',
                firstName: 'Mike',
                lastName: 'Ross',
                role: UserRole.STUDENT,
                isActive: false,
                createdAt: new Date('2023-03-05'),
                updatedAt: new Date()
            },
            {
                id: '4',
                email: 'emma.w@example.com',
                firstName: 'Emma',
                lastName: 'Wilson',
                role: UserRole.INSTRUCTOR,
                isActive: true,
                createdAt: new Date('2023-04-12'),
                updatedAt: new Date()
            },
            {
                id: '5',
                email: 'alex.t@example.com',
                firstName: 'Alex',
                lastName: 'Thompson',
                role: UserRole.STUDENT,
                isActive: true,
                createdAt: new Date('2023-05-20'),
                updatedAt: new Date()
            }
        ];
        return of(mockUsers).pipe(delay(500));
    }

    /**
     * Toggle user active status
     */
    toggleUserStatus(userId: string): Observable<boolean> {
        // Mocking API call
        console.log(`Toggling status for user ${userId}`);
        return of(true).pipe(delay(300));
    }

    /**
     * Get all feedbacks
     */
    getFeedbacks(): Observable<Feedback[]> {
        const mockFeedbacks: Feedback[] = [
            {
                id: 'f1',
                userId: 'u1',
                userName: 'Alice Spencer',
                rating: 5,
                comment: 'The conversational clubs are brilliant! I love the peer interaction.',
                courseName: 'English Conversation Club',
                createdAt: new Date('2024-02-01')
            },
            {
                id: 'f2',
                userId: 'u2',
                userName: 'Bob Miller',
                rating: 4,
                comment: 'Great platform, the instructors are very responsive.',
                courseName: 'Advanced English Masterclass',
                createdAt: new Date('2024-02-05')
            }
        ];
        return of(mockFeedbacks).pipe(delay(400));
    }

    /**
     * Get all clubs
     */
    getClubs(): Observable<Club[]> {
        const mockClubs: Club[] = [
            {
                id: 'c1',
                title: 'English Conversation Club',
                description: 'Practice speaking with peers in a fun environment.',
                category: 'Conversational',
                memberCount: 840,
                image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=400',
                icon: '💬',
                instructorName: 'Sarah Drasner',
                status: 'active'
            },
            {
                id: 'c2',
                title: 'Book & Storytelling Club',
                description: 'Explore books and improve reading skills.',
                category: 'Reading',
                memberCount: 1205,
                image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400',
                icon: '📚',
                instructorName: 'Emma Wilson',
                status: 'active'
            },
            {
                id: 'c3',
                title: 'Drama & Roleplay Club',
                description: 'Build confidence through acting and roleplays.',
                category: 'Creative',
                memberCount: 450,
                image: 'https://images.unsplash.com/photo-1533561089-13e551347012?q=80&w=400',
                icon: '🎭',
                instructorName: 'John Doe',
                status: 'active'
            }
        ];
        return of(mockClubs).pipe(delay(400));
    }
}
