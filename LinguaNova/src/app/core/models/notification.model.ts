// ============================================
// Notification Model & Related Types
// ============================================

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    icon?: string;
    actionUrl?: string;
    isRead: boolean;
    createdAt: Date;
    readAt?: Date;
}

export enum NotificationType {
    COURSE_ENROLLMENT = 'course-enrollment',
    LESSON_COMPLETED = 'lesson-completed',
    NEW_MESSAGE = 'new-message',
    ASSIGNMENT_GRADED = 'assignment-graded',
    EVENT_REMINDER = 'event-reminder',
    NEW_COURSE = 'new-course',
    COURSE_UPDATE = 'course-update',
    PAYMENT_SUCCESS = 'payment-success',
    PAYMENT_FAILED = 'payment-failed',
    SYSTEM = 'system'
}

export interface NotificationPreferences {
    userId: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    courseUpdates: boolean;
    promotionalEmails: boolean;
    weeklyDigest: boolean;
}
