
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ExamService } from './exam.service';

describe('ExamService', () => {
  let service: ExamService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExamService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ExamService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('doit recuperer tous les examens', () => {
    const mockExams = [{ id: 1, title: 'Exam 1' }] as any[];

    service.getAll().subscribe((items) => {
      expect(items).toEqual(mockExams as any);
    });

    const req = httpMock.expectOne('/exams');
    expect(req.request.method).toBe('GET');
    req.flush(mockExams);
  });

  it('doit recuperer un examen par id', () => {
    const mockExam = { id: 2, title: 'Exam 2' } as any;

    service.getById(2).subscribe((item) => {
      expect(item).toEqual(mockExam);
    });

    const req = httpMock.expectOne('/exams/2');
    expect(req.request.method).toBe('GET');
    req.flush(mockExam);
  });

  it('doit recuperer les examens publies', () => {
    service.getPublished().subscribe();

    const req = httpMock.expectOne('/exams/status/PUBLISHED');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('doit rechercher des examens par titre', () => {
    service.searchByTitle('algo').subscribe();

    const req = httpMock.expectOne((request) =>
      request.url === '/exams/search' && request.params.get('title') === 'algo'
    );
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('doit recuperer des examens par nom de cours encode', () => {
    service.getByCourseName('Math avancée').subscribe();

    const req = httpMock.expectOne('/exams/course/Math%20avanc%C3%A9e');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('doit recuperer des examens par statut', () => {
    service.getByStatus('DRAFT' as any).subscribe();

    const req = httpMock.expectOne('/exams/status/DRAFT');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('doit creer un examen', () => {
    const payload = { title: 'Nouveau' } as any;

    service.create(payload).subscribe((item) => {
      expect(item).toEqual({ id: 3, title: 'Nouveau' } as any);
    });

    const req = httpMock.expectOne('/exams');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ id: 3, title: 'Nouveau' });
  });

  it('doit mettre a jour un examen', () => {
    const payload = { title: 'Maj' } as any;

    service.update(3, payload).subscribe((item) => {
      expect(item).toEqual({ id: 3, title: 'Maj' } as any);
    });

    const req = httpMock.expectOne('/exams/3');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush({ id: 3, title: 'Maj' });
  });

  it('doit supprimer un examen', () => {
    service.delete(4).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne('/exams/4');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('doit publier un examen', () => {
    service.publish(5).subscribe((item) => {
      expect(item).toEqual({ id: 5, status: 'PUBLISHED' } as any);
    });

    const req = httpMock.expectOne('/exams/5/publish');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({ id: 5, status: 'PUBLISHED' });
  });

  it('doit fermer un examen', () => {
    service.close(6).subscribe((item) => {
      expect(item).toEqual({ id: 6, status: 'CLOSED' } as any);
    });

    const req = httpMock.expectOne('/exams/6/close');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({ id: 6, status: 'CLOSED' });
  });
});
