import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import type { StudentExam } from '../models';

@Injectable({ providedIn: 'root' })
export class StudentExamService {
  private readonly apiUrl = `${environment.apiUrl}/student-exams`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<StudentExam[]> {
    return this.http.get<StudentExam[]>(this.apiUrl);
  }

  getById(id: number): Observable<StudentExam> {
    return this.http.get<StudentExam>(`${this.apiUrl}/${id}`);
  }

  getByStudentProfileId(studentProfileId: number): Observable<StudentExam[]> {
    return this.http.get<StudentExam[]>(`${this.apiUrl}/student/${studentProfileId}`);
  }

  getByExamId(examId: number): Observable<StudentExam[]> {
    return this.http.get<StudentExam[]>(`${this.apiUrl}/exam/${examId}`);
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
