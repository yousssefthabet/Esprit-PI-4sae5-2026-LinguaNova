import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { StudentExam } from '../models/exam-student-exam.model';

@Injectable({ providedIn: 'root' })
export class StudentExamService {
  private readonly apiUrl = '/student-exams';

  constructor(private http: HttpClient) {}

  getAll(): Observable<StudentExam[]> {
    return this.http.get<StudentExam[]>(this.apiUrl);
  }

  getById(id: number): Observable<StudentExam> {
    return this.http.get<StudentExam>(`${this.apiUrl}/${id}`);
  }

  getByIdWithDetails(id: number): Observable<StudentExam> {
    return this.http.get<any>(`${this.apiUrl}/${id}/with-users`).pipe(
      map((item) => ({
        ...(item.studentExam || {}),
        student: item.student || undefined,
      } as StudentExam))
    );
  }

  getByUserId(userId: number): Observable<StudentExam[]> {
    return this.http.get<StudentExam[]>(`${this.apiUrl}/user/${userId}`);
  }

  getByExamId(examId: number): Observable<StudentExam[]> {
    return this.http.get<StudentExam[]>(`${this.apiUrl}/exam/${examId}`);
  }

  getByExamIdWithDetails(examId: number): Observable<StudentExam[]> {
    return this.http.get<any[]>(`${this.apiUrl}/exam/${examId}/with-details`).pipe(
      map((list) => (list || []).map((item) => ({
        ...(item.studentExam || {}),
        student: item.student || undefined,
      } as StudentExam)))
    );
  }

  submit(studentExam: StudentExam): Observable<StudentExam> {
    return this.http.post<StudentExam>(`${this.apiUrl}/submit`, studentExam);
  }

  create(studentExam: StudentExam): Observable<StudentExam> {
    return this.http.post<StudentExam>(this.apiUrl, studentExam);
  }

  update(id: number, studentExam: StudentExam): Observable<StudentExam> {
    return this.http.put<StudentExam>(`${this.apiUrl}/${id}`, studentExam);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
