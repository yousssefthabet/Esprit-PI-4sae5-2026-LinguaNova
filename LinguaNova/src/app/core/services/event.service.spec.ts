import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { EventService, BackendEvent } from './event.service';

describe('EventService', () => {
  let service: EventService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('loads and caches backend events', () => {
    const events: BackendEvent[] = [backendEvent(1, 3)];

    service.getAllBackendEvents().subscribe((result) => {
      expect(result).toEqual(events);
      expect(JSON.parse(localStorage.getItem('linguanova.events.cache.v1') ?? '[]')).toEqual(events);
    });

    const req = httpMock.expectOne('/events');
    expect(req.request.method).toBe('GET');
    req.flush(events);
  });

  it('falls back to cached instructor events when backend request fails', () => {
    localStorage.setItem('linguanova.events.cache.v1', JSON.stringify([
      backendEvent(1, 3),
      backendEvent(2, 9)
    ]));

    service.getBackendEventsByInstructorId(3).subscribe((result) => {
      expect(result.length).toBe(1);
      expect(result[0].instructor_id).toBe(3);
    });

    const req = httpMock.expectOne('/events/instructor/3');
    expect(req.request.method).toBe('GET');
    req.flush('error', { status: 500, statusText: 'Server Error' });
  });

  it('registers a student using the backend student_id field', () => {
    service.registerForEvent('12', 7).subscribe((result) => {
      expect(result.message).toBe('Registered successfully');
    });

    const req = httpMock.expectOne('/events/12/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ student_id: 7 });
    req.flush({ message: 'Registered successfully' });
  });

  function backendEvent(id: number, instructorId: number): BackendEvent {
    return {
      id,
      event_title: 'Conversation',
      session_description: 'Practice speaking',
      category: 'Speaking',
      event_type: 'REAL_LIFE',
      event_date: '2026-05-20',
      start_at: '10:00:00',
      ends_at: '12:00:00',
      instructor_id: instructorId
    };
  }
});
