import type { StudentExam } from './student-exam.model';
import type { Question } from './question.model';
import type { Reponse } from './reponse.model';

export interface StudentAnswer {
  id?: number;
  textAnswer?: string;
  teacherComment?: string;
  studentExam?: StudentExam;
  question?: Question;
  selectedReponse?: Reponse;
}
