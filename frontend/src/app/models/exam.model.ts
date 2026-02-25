import type { ExamStatus } from './exam-status';
import type { Question } from './question.model';

export interface Exam {
  id?: number;
  title: string;
  description: string;
  examStatus: ExamStatus;
  maxScore: number;
  courseName: string;
  createdAt?: string;
  updatedAt?: string;
  questions?: Question[];
}
