export interface QuizGenerateRequest {
  topic: string;
  difficulty: string;
  numQuestions: number;
}

export interface ExamGenerateRequest {
  title: string;
  description: string;
  courseName: string;
  difficulty: string;
  numQuestions: number;
}

export interface GeneratedQuestionDto {
  content: string;
  type: string;
  options: string[];
  correctIndex: number;
}

export interface GeneratedQuizResponse {
  title: string;
  questions: GeneratedQuestionDto[];
}
