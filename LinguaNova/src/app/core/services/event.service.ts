import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
        return this.http.get<BackendEvent[]>(`${API_ENDPOINTS.EVENTS.LIST}/instructor/${instructorId}`);
    }

    getBackendEventsJoinedByStudentId(studentId: number): Observable<BackendEvent[]> {
        return this.http.get<BackendEvent[]>(`${API_ENDPOINTS.EVENTS.LIST}/student/${studentId}`);
    }

    getAllBackendEvents(): Observable<BackendEvent[]> {
        return this.http.get<BackendEvent[]>(API_ENDPOINTS.EVENTS.LIST);
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
}
