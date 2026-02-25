import type { Question } from './question.model';

export interface Reponse {
  id?: number;
  content: string;
  correct: boolean;
  question?: Question;
}
