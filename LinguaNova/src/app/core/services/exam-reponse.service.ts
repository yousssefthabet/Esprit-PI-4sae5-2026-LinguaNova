import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { ExamReponse } from '../models/exam-reponse.model';

@Injectable({ providedIn: 'root' })
export class ExamReponseService {
  private readonly apiUrl = '/reponses';

  constructor(private http: HttpClient) {}

  getByQuestionId(questionId: number): Observable<ExamReponse[]> {
    return this.http.get<ExamReponse[]>(`${this.apiUrl}/question/${questionId}`);
  }

  getCorrectByQuestionId(questionId: number): Observable<ExamReponse[]> {
    return this.http.get<ExamReponse[]>(`${this.apiUrl}/question/${questionId}/correct`);
  }

  create(reponse: ExamReponse): Observable<ExamReponse> {
    return this.http.post<ExamReponse>(this.apiUrl, reponse);
  }

  update(id: number, reponse: ExamReponse): Observable<ExamReponse> {
    return this.http.put<ExamReponse>(`${this.apiUrl}/${id}`, reponse);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
