// ============================================
// API Constants
// ============================================

export const API_CONFIG = {
    BASE_URL: 'http://localhost:3000/api',
    TIMEOUT: 30000,
    API_VERSION: 'v1'
};

export const API_ENDPOINTS = {
    // Auth
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH_TOKEN: '/auth/refresh',
        CURRENT_USER: '/auth/me',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password'
    },
    // Courses
    COURSES: {
        LIST: '/courses',
        DETAIL: (id: string) => `/courses/${id}`,
        ENROLL: (id: string) => `/courses/${id}/enroll`,
        PROGRESS: (id: string) => `/courses/${id}/progress`,
        SEARCH: '/courses/search'
    },

    // Dashboard
    DASHBOARD: {
        STUDENT_STATS: '/dashboard/student',
        INSTRUCTOR_STATS: '/dashboard/instructor',
        ACTIVITY: '/dashboard/activity',
        UPCOMING_CLASSES: '/dashboard/upcoming-classes'
    },
    // Events
    EVENTS: {
        LIST: '/events',
        DETAIL: (id: string) => `/events/${id}`,
        CREATE: '/events',
        UPDATE: (id: string) => `/events/${id}`,
        DELETE: (id: string) => `/events/${id}`,
        REGISTER: (id: string) => `/events/${id}/register`
    },
    // Notifications
    NOTIFICATIONS: {
        LIST: '/notifications',
        MARK_READ: (id: string) => `/notifications/${id}/read`,
        MARK_ALL_READ: '/notifications/read-all',
        PREFERENCES: '/notifications/preferences'
    }
};

export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
    THEME: 'theme'
};

export const APP_CONSTANTS = {
    DEFAULT_PAGE_SIZE: 12,
    MAX_FILE_SIZE: 10485760, // 10MB in bytes
    SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    PASSWORD_MIN_LENGTH: 8
};
