import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { Note } from '../models/note.model';
import type {
  NoteCreateRequest,
  NoteUpdateRequest,
  AttachmentResponse,
  NoteImportBatchRequest,
  NoteImportBatchResponse,
} from '../models/note.model';

@Injectable({ providedIn: 'root' })
export class NoteService {
  private readonly apiUrl = '/notes';

  constructor(private http: HttpClient) {}

  getAll(userId: number): Observable<Note[]> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<Note[]>(this.apiUrl, { params });
  }

  getByCahier(userId: number, cahierId: number): Observable<Note[]> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('cahierId', cahierId.toString());
    return this.http.get<Note[]>(this.apiUrl, { params });
  }

  list(userId: number, cahierId?: number): Observable<Note[]> {
    if (cahierId) {
      return this.getByCahier(userId, cahierId);
    }
    return this.getAll(userId);
  }

  getById(id: number): Observable<Note> {
    return this.http.get<Note>(`${this.apiUrl}/${id}`);
  }

  create(req: NoteCreateRequest): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, req);
  }

  update(id: number, req: NoteUpdateRequest): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/${id}`, req);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadAttachment(noteId: number, file: File, uploadedBy: number): Observable<AttachmentResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadedBy', uploadedBy.toString());
    return this.http.post<AttachmentResponse>(`${this.apiUrl}/${noteId}/attachments`, formData);
  }

  deleteAttachment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/attachments/${id}`);
  }

  downloadAttachment(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/attachments/${id}/download`, { responseType: 'blob' });
  }

  importBatch(req: NoteImportBatchRequest): Observable<NoteImportBatchResponse> {
    return this.http.post<NoteImportBatchResponse>(`${this.apiUrl}/import-batch`, req);
  }
}
