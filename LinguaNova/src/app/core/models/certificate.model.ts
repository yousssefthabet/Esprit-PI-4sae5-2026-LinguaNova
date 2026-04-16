import type { Exam } from './exam.model';
import type { StudentExam } from './exam-student-exam.model';

export interface Certificate {
  id: number;
  certificateCode: string;
  issuedAt: string;
  userId: number;
  exam?: Exam;
  studentExam?: StudentExam;
  pdfFileName?: string;
  contentType?: string;
}
