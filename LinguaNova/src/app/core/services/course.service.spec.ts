import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { CourseService } from './course.service';

describe('CourseService', () => {
  let service: CourseService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(CourseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('gets paginated courses with filter params', () => {
    service.getCourses({ page: 2, limit: 6, sortBy: 'price-low' } as any).subscribe((result: any) => {
      expect(result.items.length).toBe(1);
    });

    const req = httpMock.expectOne((request) =>
      request.url === '/PIproject/api/courses' &&
      request.params.get('page') === '2' &&
      request.params.get('limit') === '6' &&
      request.params.get('sortBy') === 'price-low'
    );
    expect(req.request.method).toBe('GET');
    req.flush({ items: [{ id: 'course-1', title: 'English' }], pagination: {} });
  });

  it('enrolls in a course with optional Stripe session id', () => {
    service.enrollCourse('course-1', 'session-1').subscribe((result: any) => {
      expect(result.courseId).toBe('course-1');
    });

    const req = httpMock.expectOne('/PIproject/api/courses/course-1/enroll');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ stripeSessionId: 'session-1' });
    req.flush({ courseId: 'course-1', enrollmentId: 'ok', message: 'Enrolled successfully.' });
  });

  it('updates progress percent', () => {
    service.updateProgressPercent('course-1', 75).subscribe((result) => {
      expect(result.progress).toBe(75);
    });

    const req = httpMock.expectOne('/PIproject/api/courses/course-1/progress');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ progress: 75 });
    req.flush({ progress: 75 });
  });
});
