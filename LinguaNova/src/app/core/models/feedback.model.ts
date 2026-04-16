export interface Feedback {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: string;
    courseId?: string;
    courseName?: string;
    createdAt: Date;
}
