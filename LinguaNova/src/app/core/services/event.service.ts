import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Event, EventCreateData, EventUpdateData } from '../models/event.model';
import { API_ENDPOINTS } from '../constants/app.constants';

export type BackendEventType = 'REAL_LIFE' | 'LIVE_MEETING';

export interface BackendEvent {
    id: number;
    event_title: string;
    session_description: string;
    category: string;
    event_type: BackendEventType;
    event_date: string; // yyyy-MM-dd
    start_at: string; // HH:mm[:ss]
    ends_at: string; // HH:mm[:ss]
    virtual_classroom?: boolean;
    meeting_link?: string;
    instructor_id?: number;
    max_attendees?: number;
    image_url?: string;
    latitude?: number;
    location_name?: string;
    longitude?: number;
}

export interface BackendEventCreateRequest {
    event_title: string;
    session_description: string;
    category: string;
    event_type: BackendEventType;
    event_date: string; // yyyy-MM-dd
    start_at: string; // HH:mm
    ends_at: string; // HH:mm
    virtual_classroom?: boolean;
    meeting_link?: string;
    instructor_id?: number;
    max_attendees?: number;
    image_url?: string;
    latitude?: number;
    location_name?: string;
    longitude?: number;
}

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private readonly http = inject(HttpClient);
    private readonly eventsCacheKey = 'linguanova.events.cache.v1';

    /**
     * Get all events
     */
    getEvents(): Observable<Event[]> {
        return this.http.get<Event[]>(API_ENDPOINTS.EVENTS.LIST);
    }

    /**
     * Get event by ID
     */
    getEventById(id: string): Observable<Event> {
        return this.http.get<Event>(API_ENDPOINTS.EVENTS.DETAIL(id));
    }

    /**
     * Create new event
     */
    createEvent(data: EventCreateData): Observable<Event> {
        return this.http.post<Event>(API_ENDPOINTS.EVENTS.CREATE, data);
    }

    createBackendEvent(data: BackendEventCreateRequest): Observable<BackendEvent> {
        return this.http.post<BackendEvent>(API_ENDPOINTS.EVENTS.CREATE, data);
    }

    getBackendEventById(id: number): Observable<BackendEvent> {
        return this.http.get<BackendEvent>(API_ENDPOINTS.EVENTS.DETAIL(String(id)));
    }

    getBackendEventsByInstructorId(instructorId: number): Observable<BackendEvent[]> {
        return this.http.get<BackendEvent[]>(`${API_ENDPOINTS.EVENTS.LIST}/instructor/${instructorId}`).pipe(
            catchError(() => {
                const fallback = this.readEventsCacheOrFallback()
                    .filter((e) => Number(e.instructor_id ?? -1) === Number(instructorId));
                return of(fallback);
            })
        );
    }

    getBackendEventsJoinedByStudentId(studentId: number): Observable<BackendEvent[]> {
        return this.http.get<BackendEvent[]>(`${API_ENDPOINTS.EVENTS.LIST}/student/${studentId}`).pipe(
            catchError(() => of([]))
        );
    }

    getAllBackendEvents(): Observable<BackendEvent[]> {
        return this.http.get<BackendEvent[]>(API_ENDPOINTS.EVENTS.LIST).pipe(
            tap((events) => this.writeEventsCache(events ?? [])),
            catchError(() => of(this.readEventsCacheOrFallback()))
        );
    }

    updateBackendEvent(id: number, data: BackendEventCreateRequest): Observable<BackendEvent> {
        return this.http.put<BackendEvent>(API_ENDPOINTS.EVENTS.UPDATE(String(id)), data);
    }

    deleteBackendEvent(id: number): Observable<void> {
        return this.http.delete<void>(API_ENDPOINTS.EVENTS.DELETE(String(id)));
    }

    /**
     * Update existing event
     */
    updateEvent(id: string, data: EventUpdateData): Observable<Event> {
        return this.http.put<Event>(API_ENDPOINTS.EVENTS.UPDATE(id), data);
    }

    /**
     * Delete event
     */
    deleteEvent(id: string): Observable<void> {
        return this.http.delete<void>(API_ENDPOINTS.EVENTS.DELETE(id));
    }

    /**
     * Register for an event
     */
    registerForEvent(eventId: string, studentId: number): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(
            API_ENDPOINTS.EVENTS.REGISTER(eventId),
            { student_id: studentId }
        );
    }

    /**
     * Get upcoming events
     */
    getUpcomingEvents(): Observable<Event[]> {
        return this.http.get<Event[]>(`${API_ENDPOINTS.EVENTS.LIST}/upcoming`);
    }

    private writeEventsCache(events: BackendEvent[]): void {
        try {
            localStorage.setItem(this.eventsCacheKey, JSON.stringify(events));
        } catch {
            // Ignore storage failures (private mode / quota / SSR).
        }
    }

    private readEventsCache(): BackendEvent[] {
        try {
            const raw = localStorage.getItem(this.eventsCacheKey);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? (parsed as BackendEvent[]) : [];
        } catch {
            return [];
        }
    }

    private readEventsCacheOrFallback(): BackendEvent[] {
        const cached = this.readEventsCache();
        if (cached.length > 0) return cached;
        return this.buildFallbackEvents();
    }

    private buildFallbackEvents(): BackendEvent[] {
        const toIsoDate = (d: Date): string => d.toISOString().slice(0, 10);
        const plusDays = (days: number): string => {
            const d = new Date();
            d.setDate(d.getDate() + days);
            return toIsoDate(d);
        };

        return [
            {
                id: 90001,
                event_title: 'English Conversation Meetup',
                session_description: 'Practice speaking in a relaxed in-person workshop with peers and tutors.',
                category: 'Language Practice',
                event_type: 'REAL_LIFE',
                event_date: plusDays(2),
                start_at: '14:00:00',
                ends_at: '16:00:00',
                instructor_id: 3,
                max_attendees: 40,
                image_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop',
                latitude: 36.9001,
                location_name: 'Esprit Campus - Hall A',
                longitude: 10.1899
            },
            {
                id: 90002,
                event_title: 'Live Grammar Workshop',
                session_description: 'Interactive online session focused on grammar clarity and confidence.',
                category: 'Grammar',
                event_type: 'LIVE_MEETING',
                event_date: plusDays(4),
                start_at: '18:00:00',
                ends_at: '19:30:00',
                virtual_classroom: true,
                meeting_link: 'https://meet.jit.si/LinguaNova-Grammar-Workshop',
                instructor_id: 3,
                max_attendees: 120,
                image_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop'
            }
        ];
    }
}
