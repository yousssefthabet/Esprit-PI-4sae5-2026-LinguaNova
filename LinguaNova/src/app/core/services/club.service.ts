import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface BackendClub {
  id: string | number;
  slug: string;
  title: string;
  description: string;
  category: string;
  member_count: number;
  image_url: string;
  icon: string;
  instructor_name: string;
  status: 'ACTIVE' | 'ARCHIVED';
  action_label?: string;
  action_route?: string;
}

export interface ClubUpsertPayload {
  id?: string;
  slug?: string;
  title: string;
  description: string;
  category: string;
  member_count: number;
  image_url?: string | null;
  icon?: string | null;
  instructor_name: string;
  status: 'ACTIVE' | 'ARCHIVED';
  action_label?: string | null;
  action_route?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ClubService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/clubs';

  getClubs(options?: { fallback?: boolean }): Observable<BackendClub[]> {
    const shouldFallback = options?.fallback ?? true;
    const request$ = this.http.get<BackendClub[]>(this.apiUrl);
    if (!shouldFallback) {
      return request$;
    }
    return request$.pipe(catchError(() => of(this.buildFallbackClubs())));
  }

  createClub(payload: ClubUpsertPayload): Observable<BackendClub> {
    return this.http.post<BackendClub>(this.apiUrl, payload);
  }

  updateClub(id: string, payload: ClubUpsertPayload): Observable<BackendClub> {
    return this.http.put<BackendClub>(`${this.apiUrl}/${id}`, payload);
  }

  deleteClub(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private buildFallbackClubs(): BackendClub[] {
    return [
      {
        id: 1,
        slug: 'english-conversation',
        title: 'English Conversation Club',
        description: 'Practice speaking with peers in a supportive environment through interactive discussions and an AI conversation partner.',
        category: 'Conversational',
        member_count: 840,
        image_url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=400&auto=format&fit=crop',
        icon: 'chat',
        instructor_name: 'Sarah Drasner',
        status: 'ACTIVE',
        action_label: 'Open AI conversation club',
        action_route: '/clubs/english-conversation'
      },
      {
        id: 2,
        slug: 'book-storytelling',
        title: 'Book & Storytelling Club',
        description: 'Improve reading skills and vocabulary by exploring books, short stories, and creative storytelling activities.',
        category: 'Reading',
        member_count: 1205,
        image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop',
        icon: 'book',
        instructor_name: 'Emma Wilson',
        status: 'ACTIVE',
        action_label: 'Open Book & Storytelling club',
        action_route: '/clubs/book-storytelling'
      },
      {
        id: 3,
        slug: 'drama-roleplay',
        title: 'Drama & Roleplay Club',
        description: 'Build confidence and communication by acting out practical scenarios and roleplay exercises.',
        category: 'Creative',
        member_count: 450,
        image_url: 'https://images.unsplash.com/photo-1533561089-13e551347012?q=80&w=400&auto=format&fit=crop',
        icon: 'drama',
        instructor_name: 'John Doe',
        status: 'ACTIVE',
        action_label: 'Open Drama & Roleplay club',
        action_route: '/clubs/drama-roleplay'
      },
      {
        id: 4,
        slug: 'writing-grammar',
        title: 'Writing & Grammar Club',
        description: 'Enhance writing quality with grammar guidance, sentence structure practice, and concise feedback loops.',
        category: 'Writing',
        member_count: 610,
        image_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=400&auto=format&fit=crop',
        icon: 'pen',
        instructor_name: 'Alice Spencer',
        status: 'ACTIVE',
        action_label: 'Open Writing & Grammar club',
        action_route: '/clubs/writing-grammar'
      }
    ];
  }
}
