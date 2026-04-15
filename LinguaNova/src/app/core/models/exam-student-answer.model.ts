import type { StudentExam } from './exam-student-exam.model';
import type { Question } from './exam-question.model';
import type { ExamReponse } from './exam-reponse.model';

export interface StudentAnswer {
  id?: number;
  textAnswer?: string;
  teacherComment?: string;
  studentExam?: StudentExam;
  question?: Question;
  selectedReponse?: ExamReponse;
}
