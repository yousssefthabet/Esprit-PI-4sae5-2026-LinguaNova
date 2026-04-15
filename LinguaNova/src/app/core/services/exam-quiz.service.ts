import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { GeneratedQuizResponse, QuizGenerateRequest, ExamGenerateRequest } from '../models/generated-quiz.model';

@Injectable({ providedIn: 'root' })
export class ExamQuizService {
  private readonly generateUrl = '/quiz/generate';
  private readonly generateExamUrl = '/quiz/generate-exam-questions';

  constructor(private http: HttpClient) {}

  generate(request: QuizGenerateRequest): Observable<GeneratedQuizResponse> {
    return this.http.post<GeneratedQuizResponse>(this.generateUrl, request);
  }

  generateExamQuestions(request: ExamGenerateRequest): Observable<GeneratedQuizResponse> {
    return this.http.post<GeneratedQuizResponse>(this.generateExamUrl, request);
  }
}
