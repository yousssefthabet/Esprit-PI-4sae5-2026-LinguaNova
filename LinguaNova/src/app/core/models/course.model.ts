// ============================================
// Course Model & Related Types
// ============================================

export interface Course {
    id: string;
    title: string;
    description: string;
    shortDescription: string;
    instructor: CourseInstructor;
    image: string;
    price: number;
    discountedPrice?: number;
    category: CourseCategory;
    level: CourseLevel;
    duration: number; // in hours
    lessonsCount: number;
    studentsCount: number;
    rating: number;
    reviewsCount: number;
    language: string;
    subtitles: string[];
    syllabus: CourseSyllabus[];
    /** Quizzes returned by API when loading course by ID */
    quizzes?: CourseQuiz[];
    requirements: string[];
    learningOutcomes: string[];
    tags: string[];
    isFeatured: boolean;
    isPublished: boolean;
    progress?: number; // Completion percentage (0-100)
    displayTag?: string; // e.g. "Blended learning"
    priceSuffix?: string; // e.g. "/mo"
    iconType?: 'speech' | 'pencil' | 'audio' | 'briefcase';
    createdAt: Date;
    updatedAt: Date;
}

export interface CourseInstructor {
    id: string;
    name: string;
    title: string;
    avatar: string;
    bio: string;
    coursesCount: number;
    studentsCount: number;
    rating: number;
}

export interface CourseSyllabus {
    id: string;
    title: string;
    lessons: CourseLesson[];
    duration: number;
}

export interface CourseLesson {
    id: string;
    title: string;
    type: LessonType;
    duration?: number; // in minutes (optional; API may not return)
    isPreview: boolean;
    videoUrl?: string;
    /** PDF or other file URL (from API fileUrl) */
    fileUrl?: string;
    fileName?: string;
    resources?: LessonResource[];
}

export interface LessonResource {
    id: string;
    title: string;
    type: 'pdf' | 'doc' | 'video' | 'link';
    url: string;
    size?: string;
}

/** Quiz as returned by API on course detail (matches QuizDTO) */
export interface CourseQuiz {
    id: string;
    title: string;
    passingScore?: number;
    questions?: CourseQuizQuestion[];
}

export interface CourseQuizQuestion {
    id: string;
    text: string;
    type?: string;
    options?: string[];
    correctAnswer?: string;
    explanation?: string;
    points?: number;
}

export enum CourseCategory {
    ENGLISH_LANGUAGE = 'English Language',
    GENERAL_ENGLISH = 'General English',
    BUSINESS_ENGLISH = 'Business English',
    ACADEMIC_ENGLISH = 'Academic English',
    ENGLISH_COMMUNICATION = 'English Communication',
    IELTS_PREPARATION = 'IELTS Preparation',
    TOEFL_PREPARATION = 'TOEFL Preparation'
}

export enum CourseLevel {
    BEGINNER = 'Beginner',
    ELEMENTARY = 'Elementary',
    PRE_INTERMEDIATE = 'Pre-Intermediate',
    INTERMEDIATE = 'Intermediate',
    UPPER_INTERMEDIATE = 'Upper-Intermediate',
    ADVANCED = 'Advanced'
}

export enum LessonType {
    VIDEO = 'video',
    QUIZ = 'quiz',
    ASSIGNMENT = 'assignment',
    READING = 'reading',
    LIVE = 'live'
}

/** Payload for creating/updating a course. Matches backend CourseRequest and form labels (Course Title, Short Hook, etc.). */
export interface CreateCoursePayload {
    title: string;                    // Course Title
    shortDescription: string;         // Short Hook
    description: string;              // Full Prospectus
    category: string;                 // Academic Category (enum name e.g. ENGLISH_LANGUAGE)
    level: string;                    // Skill Elevation (enum name e.g. BEGINNER)
    price: number;                    // Listing Price
    image: string;                   // Course Thumbnail
    isPublished: boolean;
    language: string;
    syllabus: CreateCourseSyllabusSection[];  // Curriculum: sections + lessons
    quizzes: CreateCourseQuiz[];
}

export interface CreateCourseSyllabusSection {
    title: string;                    // Module / Section title
    lessons: CreateCourseLesson[];
}

export interface CreateCourseLesson {
    title: string;
    type: string;                     // VIDEO | PDF
    isPreview?: boolean;
    fileName?: string;
    fileUrl?: string;
}

export interface CreateCourseQuiz {
    title: string;
    passingScore: number;
    questions: CreateCourseQuestion[];
}

export interface CreateCourseQuestion {
    text: string;
    type: string;                     // MULTIPLE_CHOICE | SINGLE_CHOICE | TRUE_FALSE
    options: string[];
    correctAnswer: string;
    explanation?: string;
    points?: number;
}

export interface CourseFilters {
    category?: CourseCategory[];
    level?: CourseLevel[];
    priceRange?: [number, number];
    rating?: number;
    duration?: [number, number];
    search?: string;
    sortBy?: 'popular' | 'newest' | 'price-low' | 'price-high' | 'rating';
    page?: number;
    limit?: number;
}

export interface EnrollmentResponse {
    courseId: string;
    enrollmentId: string;
    message: string;
    paymentUrl?: string;
}
