import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { Certificate } from '../models/certificate.model';

@Injectable({ providedIn: 'root' })
export class CertificateService {
  private readonly apiUrl = '/certificates';

  constructor(private http: HttpClient) {}

  getByUserId(userId: number): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${this.apiUrl}/by-user/${userId}`);
  }

  generate(studentExamId: number): Observable<Certificate> {
    return this.http.post<Certificate>(`${this.apiUrl}/generate/${studentExamId}`, {});
  }

  downloadPdf(certificateId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${certificateId}/pdf`, { responseType: 'blob' });
  }
}
