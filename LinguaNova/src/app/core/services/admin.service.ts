import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, map } from 'rxjs';
import { User, UserRole } from '../models/user.model';
import { Feedback } from '../models/feedback.model';
import { BackendClub, ClubService, ClubUpsertPayload } from './club.service';

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
    slug: string;
    title: string;
    description: string;
    category: string;
    memberCount: number;
    image: string;
    icon: string;
    instructorName: string;
    status: 'active' | 'archived';
    actionLabel?: string;
    actionRoute?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private readonly http = inject(HttpClient);
    private readonly clubService = inject(ClubService);

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
        return this.clubService.getClubs({ fallback: false }).pipe(
            map((clubs) => (clubs ?? []).map((club) => this.toAdminClub(club))),
            delay(200)
        );
    }

    createClub(club: Omit<Club, 'id'>): Observable<Club> {
        return this.clubService.createClub(this.toBackendPayload(club)).pipe(
            map((created) => this.toAdminClub(created))
        );
    }

    updateClub(id: string, club: Omit<Club, 'id'>): Observable<Club> {
        return this.clubService.updateClub(id, this.toBackendPayload(club)).pipe(
            map((updated) => this.toAdminClub(updated))
        );
    }

    deleteClub(id: string): Observable<void> {
        return this.clubService.deleteClub(id);
    }

    private toAdminClub(club: BackendClub): Club {
        return {
            id: String(club.id),
            slug: club.slug || '',
            title: club.title,
            description: club.description,
            category: club.category,
            memberCount: club.member_count ?? 0,
            image: club.image_url || '',
            icon: club.icon || 'club',
            instructorName: club.instructor_name || 'Instructor',
            status: club.status === 'ARCHIVED' ? 'archived' : 'active',
            actionLabel: club.action_label || undefined,
            actionRoute: club.action_route || undefined
        };
    }

    private toBackendPayload(club: Omit<Club, 'id'>): ClubUpsertPayload {
        return {
            slug: (club.slug || '').trim() || undefined,
            title: club.title,
            description: club.description,
            category: club.category,
            member_count: Math.max(0, Number(club.memberCount) || 0),
            image_url: (club.image || '').trim() || null,
            icon: (club.icon || '').trim() || null,
            instructor_name: club.instructorName,
            status: club.status === 'archived' ? 'ARCHIVED' : 'ACTIVE',
            action_label: (club.actionLabel || '').trim() || null,
            action_route: (club.actionRoute || '').trim() || null
        };
    }
}


