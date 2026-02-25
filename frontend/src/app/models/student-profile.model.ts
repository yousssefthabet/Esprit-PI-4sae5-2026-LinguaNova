export interface StudentProfile {
  id?: number;
  lastName: string;
  firstName: string;
  phone: string;
  birthDate: string;
  studentExams?: unknown[];
}
