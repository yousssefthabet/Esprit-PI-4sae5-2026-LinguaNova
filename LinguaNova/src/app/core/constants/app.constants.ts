// ============================================
// API Constants
// ============================================

export const API_CONFIG = {
    // Relative URLs: dev server proxies /api → :3000, /PIproject → :8081 (avoids CORS)
    BASE_URL: '/api',
    COURSE_SERVICE_URL: '/PIproject/api',
    TIMEOUT: 30000,
    API_VERSION: 'v1'
};

export const API_ENDPOINTS = {
    // Auth (user-service backend at /PIproject/api/auth)
    AUTH: {
        BASE: '/PIproject/api/auth',
        LOGIN: '/PIproject/api/auth/login',
        REGISTER_STUDENT: '/PIproject/api/auth/register/student',
        REGISTER_TEACHER: '/PIproject/api/auth/register/teacher',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH_TOKEN: '/auth/refresh',
        CURRENT_USER: '/PIproject/api/auth/me',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password'
    },
    // Courses
    COURSES: {
        LIST: '/courses',
        DETAIL: (id: string) => `/courses/${id}`,
        ENROLL: (id: string) => `/courses/${id}/enroll`,
        PROGRESS: (id: string) => `/courses/${id}/progress`,
        SEARCH: '/courses/search',
        INSTRUCTOR_COURSES: '/courses/instructor'
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
    PASSWORD_MIN_LENGTH: 8,
    /** Shown when a course has no Course Thumbnail or thumbnail fails to load (inline SVG so it always loads) */
    DEFAULT_COURSE_IMAGE: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"><rect fill="%230D9488" width="800" height="400"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="sans-serif" font-size="24" font-weight="bold">Course</text></svg>')
};
