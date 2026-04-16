// ============================================
// Common Models & Shared Types
// ============================================

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: ApiError[];
}

export interface ApiError {
    field?: string;
    message: string;
    code?: string;
}

export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface PaginatedResponse<T> {
    items: T[];
    pagination: PaginationMeta;
}

export interface SelectOption<T = string> {
    label: string;
    value: T;
    disabled?: boolean;
}

export interface Stats {
    label: string;
    value: number | string;
    icon?: string;
    trend?: {
        value: number;
        direction: 'up' | 'down';
    };
}

export interface Activity {
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: Date;
    icon?: string;
    link?: string;
}

export interface ClassSchedule {
    id: string;
    courseId: string;
    courseName: string;
    instructorName: string;
    startTime: Date;
    endTime: Date;
    meetingUrl?: string;
    status: 'upcoming' | 'live' | 'ended';
}
