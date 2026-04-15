import type { QuestionType } from './question-type';
import type { Exam } from './exam.model';
import type { ExamReponse } from './exam-reponse.model';

export interface Question {
  id?: number;
  content: string;
  score: number;
  type: QuestionType;
  exam?: Exam;
  reponses?: ExamReponse[];
}
