// ============================================
// Event Model & Related Types
// ============================================

export interface Event {
    id: string;
    title: string;
    description: string;
    type: EventType;
    startDate: Date;
    endDate: Date;
    location?: string; // for in-person events
    meetingUrl?: string; // for online events
    organizer: EventOrganizer;
    maxAttendees?: number;
    currentAttendees: number;
    image?: string;
    tags: string[];
    isPublic: boolean;
    requiresApproval: boolean;
    price?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface EventOrganizer {
    id: string;
    name: string;
    title: string;
    avatar: string;
}

export enum EventType {
    WEBINAR = 'webinar',
    WORKSHOP = 'workshop',
    CONFERENCE = 'conference',
    MEETUP = 'meetup',
    LIVE_CLASS = 'live-class',
    QA_SESSION = 'qa-session'
}

export interface EventCreateData {
    title: string;
    description: string;
    type: EventType;
    startDate: Date;
    endDate: Date;
    location?: string;
    meetingUrl?: string;
    maxAttendees?: number;
    image?: string;
    tags: string[];
    isPublic: boolean;
    requiresApproval: boolean;
    price?: number;
}

export interface EventUpdateData extends Partial<EventCreateData> {
    id: string;
}

export interface EventAttendee {
    id: string;
    eventId: string;
    user: {
        id: string;
        name: string;
        email: string;
        avatar: string;
    };
    status: AttendeeStatus;
    registeredAt: Date;
}

export enum AttendeeStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    ATTENDED = 'attended',
    NO_SHOW = 'no-show'
}
