import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface TextToSpeechPayload {
  text: string;
  language: string;
  voice: string;
  speechRate: number;
  userId?: string;
}

export interface TextToSpeechResult {
  mimeType: string;
  fileName: string;
  audioBase64: string;
  message: string;
}

export interface SpeechToTextResult {
  text: string;
  language: string;
  confidence: number;
  message: string;
}

export interface SimplifyTextPayload {
  text: string;
  userId?: string;
}

export interface SimplifyTextResult {
  simplifiedText: string;
  originalLength: number;
  simplifiedLength: number;
}

@Injectable({ providedIn: 'root' })
export class AccessibilityAiService {
  private readonly http = inject(HttpClient);
  // Keep both routes for compatibility across running backend versions.
  private readonly primaryBaseUrl = '/events/accessibility';
  private readonly legacyBaseUrl = '/ai/accessibility';

  textToSpeech(payload: TextToSpeechPayload): Observable<TextToSpeechResult> {
    return this.postWithRouteFallback<TextToSpeechResult>('/text-to-speech', payload);
  }

  speechToText(audioFile: File, userId?: string): Observable<SpeechToTextResult> {
    const formData = new FormData();
    formData.append('audio', audioFile);
    if (userId?.trim()) {
      formData.append('userId', userId.trim());
    }
    return this.postWithRouteFallback<SpeechToTextResult>('/speech-to-text', formData);
  }

  simplifyText(payload: SimplifyTextPayload): Observable<SimplifyTextResult> {
    return this.postWithRouteFallback<SimplifyTextResult>('/simplify-text', payload);
  }

  private postWithRouteFallback<T>(path: string, body: unknown): Observable<T> {
    const primaryUrl = `${this.primaryBaseUrl}${path}`;
    const legacyUrl = `${this.legacyBaseUrl}${path}`;

    return this.http.post<T>(primaryUrl, body).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return this.http.post<T>(legacyUrl, body);
        }
        return throwError(() => error);
      })
    );
  }
}
