import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import type { GeneratedQuizResponse, QuizGenerateRequest, ExamGenerateRequest } from '../models/generated-quiz.model';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private readonly quizBaseUrl =
    (environment as { quizApiUrl?: string }).quizApiUrl?.trim() || environment.apiUrl;
  private readonly generateUrl = `${this.quizBaseUrl}/quiz/generate`;
  private readonly generateExamUrl = `${this.quizBaseUrl}/quiz/generate-exam-questions`;

  constructor(private http: HttpClient) { }

  generate(request: QuizGenerateRequest): Observable<GeneratedQuizResponse> {
    return this.http.post<GeneratedQuizResponse>(this.generateUrl, request);
  }

  generateExamQuestions(request: ExamGenerateRequest): Observable<GeneratedQuizResponse> {
    return this.http.post<GeneratedQuizResponse>(this.generateExamUrl, request);
  }
}
