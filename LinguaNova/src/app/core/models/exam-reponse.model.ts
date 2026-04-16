import type { Question } from './exam-question.model';

export interface ExamReponse {
  id?: number;
  content: string;
  correct: boolean;
  question?: Question;
}
