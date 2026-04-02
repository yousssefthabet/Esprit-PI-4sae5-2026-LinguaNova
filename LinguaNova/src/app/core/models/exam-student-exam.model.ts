import type { Exam } from './exam.model';
import type { StudentAnswer } from './exam-student-answer.model';

export interface StudentExamUserInfo {
  id?: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface StudentExam {
  id?: number;
  userId?: number;
  score?: number;
  submittedAt?: string;
  validated?: boolean;
  exam?: Exam;
  answers?: StudentAnswer[];
  student?: StudentExamUserInfo;
}
