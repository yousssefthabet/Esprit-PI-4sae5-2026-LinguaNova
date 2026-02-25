import type { StudentProfile } from './student-profile.model';
import type { Exam } from './exam.model';
import type { StudentAnswer } from './student-answer.model';

export interface StudentExam {
  id?: number;
  score?: number;
  submittedAt?: string;
  validated?: boolean;
  studentProfile?: StudentProfile;
  exam?: Exam;
  answers?: StudentAnswer[];
}
