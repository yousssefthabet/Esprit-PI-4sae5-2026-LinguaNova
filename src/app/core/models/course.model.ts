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
    duration: number; // in minutes
    isPreview: boolean;
    videoUrl?: string;
    resources?: LessonResource[];
}

export interface LessonResource {
    id: string;
    title: string;
    type: 'pdf' | 'doc' | 'video' | 'link';
    url: string;
    size?: string;
}

export enum CourseCategory {
    WEB_DEVELOPMENT = 'web-development',
    MOBILE_DEVELOPMENT = 'mobile-development',
    DATA_SCIENCE = 'data-science',
    DESIGN = 'design',
    BUSINESS = 'business',
    MARKETING = 'marketing',
    PHOTOGRAPHY = 'photography',
    MUSIC = 'music',
    HEALTH = 'health',
    LANGUAGE = 'language'
}

export enum CourseLevel {
    BEGINNER = 'beginner',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced',
    ALL_LEVELS = 'all-levels'
}

export enum LessonType {
    VIDEO = 'video',
    QUIZ = 'quiz',
    ASSIGNMENT = 'assignment',
    READING = 'reading',
    LIVE = 'live'
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

export interface CourseProgress {
    courseId: string;
    completedLessons: string[];
    currentLesson?: string;
    progressPercentage: number;
    lastAccessedAt: Date;
}
