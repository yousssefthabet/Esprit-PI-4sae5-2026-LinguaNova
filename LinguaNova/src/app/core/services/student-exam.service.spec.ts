import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { StudentExamService } from './student-exam.service';

describe('StudentExamService', () => {
  let service: StudentExamService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StudentExamService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(StudentExamService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('doit recuperer toutes les soumissions examens etudiants', () => {
    const mockList = [{ id: 1 }, { id: 2 }] as any[];

    service.getAll().subscribe((items) => {
      expect(items).toEqual(mockList as any);
    });

    const req = httpMock.expectOne('/student-exams');
    expect(req.request.method).toBe('GET');
    req.flush(mockList);
  });

  it('doit recuperer une soumission par id', () => {
    const mockItem = { id: 10 } as any;

    service.getById(10).subscribe((item) => {
      expect(item).toEqual(mockItem);
    });

    const req = httpMock.expectOne('/student-exams/10');
    expect(req.request.method).toBe('GET');
    req.flush(mockItem);
  });

  it('doit mapper getByIdWithDetails', () => {
    const apiPayload = {
      studentExam: { id: 11, score: 14 },
      student: { id: 99, firstName: 'Ali' },
    };

    service.getByIdWithDetails(11).subscribe((item: any) => {
      expect(item.id).toBe(11);
      expect(item.score).toBe(14);
      expect(item.student).toEqual({ id: 99, firstName: 'Ali' });
    });

    const req = httpMock.expectOne('/student-exams/11/with-users');
    expect(req.request.method).toBe('GET');
    req.flush(apiPayload);
  });

  it('doit recuperer les soumissions par user id', () => {
    service.getByUserId(7).subscribe();

    const req = httpMock.expectOne('/student-exams/user/7');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('doit recuperer les soumissions par exam id', () => {
    service.getByExamId(5).subscribe();

    const req = httpMock.expectOne('/student-exams/exam/5');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('doit mapper getByExamIdWithDetails', () => {
    const apiPayload = [
      {
        studentExam: { id: 1, score: 8 },
        student: { id: 101, firstName: 'Sara' },
      },
      {
        studentExam: { id: 2, score: 18 },
        student: { id: 102, firstName: 'Yassine' },
      },
    ];

    service.getByExamIdWithDetails(3).subscribe((items: any[]) => {
      expect(items.length).toBe(2);
      expect(items[0].id).toBe(1);
      expect(items[0].student.firstName).toBe('Sara');
      expect(items[1].id).toBe(2);
      expect(items[1].student.firstName).toBe('Yassine');
    });

    const req = httpMock.expectOne('/student-exams/exam/3/with-details');
    expect(req.request.method).toBe('GET');
    req.flush(apiPayload);
  });

  it('doit soumettre une tentative examen', () => {
    const payload = { examId: 9, userId: 2 } as any;

    service.submit(payload).subscribe((item) => {
      expect(item).toEqual({ id: 30, examId: 9, userId: 2 } as any);
    });

    const req = httpMock.expectOne('/student-exams/submit');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ id: 30, examId: 9, userId: 2 });
  });

  it('doit creer une soumission', () => {
    const payload = { examId: 1 } as any;

    service.create(payload).subscribe((item) => {
      expect(item).toEqual({ id: 44, examId: 1 } as any);
    });

    const req = httpMock.expectOne('/student-exams');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ id: 44, examId: 1 });
  });

  it('doit mettre a jour une soumission', () => {
    const payload = { score: 16 } as any;

    service.update(44, payload).subscribe((item) => {
      expect(item).toEqual({ id: 44, score: 16 } as any);
    });

    const req = httpMock.expectOne('/student-exams/44');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush({ id: 44, score: 16 });
  });

  it('doit supprimer une soumission', () => {
    service.delete(44).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne('/student-exams/44');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
