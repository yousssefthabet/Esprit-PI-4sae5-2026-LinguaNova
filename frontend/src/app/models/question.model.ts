import type { QuestionType } from './question-type';
import type { Exam } from './exam.model';
import type { Reponse } from './reponse.model';

export interface Question {
  id?: number;
  content: string;
  score: number;
  type: QuestionType;
  exam?: Exam;
  reponses?: Reponse[];
}
