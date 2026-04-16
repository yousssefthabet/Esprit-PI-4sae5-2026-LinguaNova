import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { Cahier, CahierCreateRequest } from '../models/cahier.model';
import type { NoteContextType } from '../models/note-context-type';

@Injectable({ providedIn: 'root' })
export class CahierService {
  private readonly apiUrl = '/cahiers';

  constructor(private http: HttpClient) {}

  list(userId: number, contextType?: NoteContextType): Observable<Cahier[]> {
    let params = new HttpParams().set('userId', userId);
    if (contextType) {
      params = params.set('contextType', contextType);
    }
    return this.http.get<Cahier[]>(this.apiUrl, { params });
  }

  create(req: CahierCreateRequest): Observable<Cahier> {
    return this.http.post<Cahier>(this.apiUrl, req);
  }

  update(id: number, req: CahierCreateRequest): Observable<Cahier> {
    return this.http.put<Cahier>(`${this.apiUrl}/${id}`, req);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<Cahier[]> {
    return this.http.get<Cahier[]>(this.apiUrl);
  }

  getById(id: number): Observable<Cahier> {
    return this.http.get<Cahier>(`${this.apiUrl}/${id}`);
  }
}
