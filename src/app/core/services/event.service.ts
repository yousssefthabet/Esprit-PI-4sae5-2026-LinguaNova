import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event, EventCreateData, EventUpdateData } from '../models/event.model';
import { API_ENDPOINTS } from '../constants/app.constants';

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
    registerForEvent(eventId: string): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(
            API_ENDPOINTS.EVENTS.REGISTER(eventId),
            {}
        );
    }

    /**
     * Get upcoming events
     */
    getUpcomingEvents(): Observable<Event[]> {
        return this.http.get<Event[]>(`${API_ENDPOINTS.EVENTS.LIST}/upcoming`);
    }
}
