export interface StudentStats {
    enrolledCourses: number;
    completedCourses: number;
    totalLearningTime: number; // in hours
    certificatesEarned: number;
    points: number;
}

export interface InstructorStats {
    totalStudents: number;
    activeCourses: number;
    averageRating: number;
    totalEarnings: number;
}

export interface RecentActivity {
    id: string;
    type: string;
    description: string;
    timestamp: Date;
    title?: string;
    icon?: string;
}

export interface ClassSchedule {
    id: string;
    courseId: string;
    courseName: string;
    instructorName: string;
    startTime: Date;
    endTime: Date;
    meetingUrl: string;
    status: 'upcoming' | 'live' | 'ended';
    progress?: number;
    currentLesson?: string;
}
