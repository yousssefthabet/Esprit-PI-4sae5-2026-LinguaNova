import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { StudentAnswer } from '../models/exam-student-answer.model';

@Injectable({ providedIn: 'root' })
export class StudentAnswerService {
  private readonly apiUrl = '/student-answers';

  constructor(private http: HttpClient) {}

  getAll(): Observable<StudentAnswer[]> {
    return this.http.get<StudentAnswer[]>(this.apiUrl);
  }

  getById(id: number): Observable<StudentAnswer> {
    return this.http.get<StudentAnswer>(`${this.apiUrl}/${id}`);
  }

  create(answer: StudentAnswer): Observable<StudentAnswer> {
    return this.http.post<StudentAnswer>(this.apiUrl, answer);
  }

  update(id: number, answer: StudentAnswer): Observable<StudentAnswer> {
    return this.http.put<StudentAnswer>(`${this.apiUrl}/${id}`, answer);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
