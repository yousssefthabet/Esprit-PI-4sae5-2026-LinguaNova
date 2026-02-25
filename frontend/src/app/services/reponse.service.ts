import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import type { Reponse } from '../models';

@Injectable({ providedIn: 'root' })
export class ReponseService {
  private readonly apiUrl = `${environment.apiUrl}/reponses`;

  constructor(private http: HttpClient) {}

  getByQuestionId(questionId: number): Observable<Reponse[]> {
    return this.http.get<Reponse[]>(`${this.apiUrl}/question/${questionId}`);
  }

  getCorrectByQuestionId(questionId: number): Observable<Reponse[]> {
    return this.http.get<Reponse[]>(`${this.apiUrl}/question/${questionId}/correct`);
  }

  create(reponse: Reponse): Observable<Reponse> {
    return this.http.post<Reponse>(this.apiUrl, reponse);
  }

  update(id: number, reponse: Reponse): Observable<Reponse> {
    return this.http.put<Reponse>(`${this.apiUrl}/${id}`, reponse);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
