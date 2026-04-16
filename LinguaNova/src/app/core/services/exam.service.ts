import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { Exam } from '../models/exam.model';
import type { ExamStatus } from '../models/exam-status';

@Injectable({ providedIn: 'root' })
export class ExamService {
  private readonly apiUrl = '/exams';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Exam[]> {
    return this.http.get<Exam[]>(this.apiUrl);
  }

  getById(id: number): Observable<Exam> {
    return this.http.get<Exam>(`${this.apiUrl}/${id}`);
  }

  getPublished(): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${this.apiUrl}/status/PUBLISHED`);
  }

  searchByTitle(title: string): Observable<Exam[]> {
    const params = new HttpParams().set('title', title);
    return this.http.get<Exam[]>(`${this.apiUrl}/search`, { params });
  }

  getByCourseName(courseName: string): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${this.apiUrl}/course/${encodeURIComponent(courseName)}`);
  }

  getByStatus(status: ExamStatus): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${this.apiUrl}/status/${status}`);
  }

  create(exam: Exam): Observable<Exam> {
    return this.http.post<Exam>(this.apiUrl, exam);
  }

  update(id: number, exam: Exam): Observable<Exam> {
    return this.http.put<Exam>(`${this.apiUrl}/${id}`, exam);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  publish(id: number): Observable<Exam> {
    return this.http.post<Exam>(`${this.apiUrl}/${id}/publish`, {});
  }

  close(id: number): Observable<Exam> {
    return this.http.post<Exam>(`${this.apiUrl}/${id}/close`, {});
  }
}
