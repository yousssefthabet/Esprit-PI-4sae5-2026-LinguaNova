export interface Quiz {
    id: string;
    title: string;
    description?: string;
    questions: Question[];
    passingScore: number;
    timeLimit?: number; // in minutes
    isFinalExam?: boolean;
}

export interface Question {
    id: string;
    text: string;
    type: 'multiple_choice' | 'single_choice' | 'true_false';
    options: string[];
    correctAnswer: string | string[];
    explanation?: string;
    points: number;
}
