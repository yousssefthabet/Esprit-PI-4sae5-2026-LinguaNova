import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { BackendClub, ClubService } from './club.service';

describe('ClubService', () => {
  let service: ClubService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ClubService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('loads clubs from the backend', () => {
    const clubs: BackendClub[] = [club()];

    service.getClubs({ fallback: false }).subscribe((result) => {
      expect(result).toEqual(clubs);
    });

    const req = httpMock.expectOne('/clubs');
    expect(req.request.method).toBe('GET');
    req.flush(clubs);
  });

  it('returns fallback clubs when enabled and backend fails', () => {
    service.getClubs().subscribe((result) => {
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].slug).toBe('english-conversation');
    });

    const req = httpMock.expectOne('/clubs');
    req.flush('error', { status: 500, statusText: 'Server Error' });
  });

  it('updates a club by id', () => {
    const payload = {
      title: 'Updated',
      description: 'Updated description',
      category: 'Speaking',
      member_count: 12,
      instructor_name: 'Amina',
      status: 'ACTIVE' as const
    };

    service.updateClub('club-1', payload).subscribe((result) => {
      expect(result.title).toBe('Updated');
    });

    const req = httpMock.expectOne('/clubs/club-1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush({ ...club(), ...payload });
  });

  function club(): BackendClub {
    return {
      id: 'club-1',
      slug: 'english-conversation',
      title: 'English Conversation Club',
      description: 'Practice speaking',
      category: 'Speaking',
      member_count: 10,
      image_url: 'image.jpg',
      icon: 'chat',
      instructor_name: 'Amina',
      status: 'ACTIVE'
    };
  }
});
