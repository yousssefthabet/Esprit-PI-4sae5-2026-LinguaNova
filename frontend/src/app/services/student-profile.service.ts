import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import type { StudentProfile } from '../models';

@Injectable({ providedIn: 'root' })
export class StudentProfileService {
  private readonly apiUrl = `${environment.apiUrl}/student-profiles`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<StudentProfile[]> {
    return this.http.get<StudentProfile[]>(this.apiUrl);
  }

  getById(id: number): Observable<StudentProfile> {
    return this.http.get<StudentProfile>(`${this.apiUrl}/${id}`);
  }

  create(profile: StudentProfile): Observable<StudentProfile> {
    return this.http.post<StudentProfile>(this.apiUrl, profile);
  }

  update(id: number, profile: StudentProfile): Observable<StudentProfile> {
    return this.http.put<StudentProfile>(`${this.apiUrl}/${id}`, profile);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
