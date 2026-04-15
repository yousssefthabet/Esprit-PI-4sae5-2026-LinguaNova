import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Notification, NotificationPreferences } from '../models/notification.model';
import { API_ENDPOINTS } from '../constants/app.constants';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private readonly http = inject(HttpClient);

    private notificationsSubject = new BehaviorSubject<Notification[]>([]);
    public notifications$ = this.notificationsSubject.asObservable();

    private unreadCountSubject = new BehaviorSubject<number>(0);
    public unreadCount$ = this.unreadCountSubject.asObservable();

    /**
     * Load all notifications
     */
    loadNotifications(): Observable<Notification[]> {
        return this.http.get<Notification[]>(API_ENDPOINTS.NOTIFICATIONS.LIST).pipe(
            tap(notifications => {
                this.notificationsSubject.next(notifications);
                this.updateUnreadCount(notifications);
            })
        );
    }

    /**
     * Mark notification as read
     */
    markAsRead(id: string): Observable<void> {
        return this.http.patch<void>(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id), {}).pipe(
            tap(() => this.updateLocalNotification(id, true))
        );
    }

    /**
     * Mark all notifications as read
     */
    markAllAsRead(): Observable<void> {
        return this.http.post<void>(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ, {}).pipe(
            tap(() => {
                const notifications = this.notificationsSubject.value.map(n => ({
                    ...n,
                    isRead: true
                }));
                this.notificationsSubject.next(notifications);
                this.unreadCountSubject.next(0);
            })
        );
    }

    /**
     * Get notification preferences
     */
    getPreferences(): Observable<NotificationPreferences> {
        return this.http.get<NotificationPreferences>(API_ENDPOINTS.NOTIFICATIONS.PREFERENCES);
    }

    /**
     * Update notification preferences
     */
    updatePreferences(preferences: Partial<NotificationPreferences>): Observable<NotificationPreferences> {
        return this.http.patch<NotificationPreferences>(
            API_ENDPOINTS.NOTIFICATIONS.PREFERENCES,
            preferences
        );
    }

    // Private helpers

    private updateLocalNotification(id: string, isRead: boolean): void {
        const notifications = this.notificationsSubject.value.map(n =>
            n.id === id ? { ...n, isRead, readAt: isRead ? new Date() : undefined } : n
        );
        this.notificationsSubject.next(notifications);
        this.updateUnreadCount(notifications);
    }

    private updateUnreadCount(notifications: Notification[]): void {
        const unreadCount = notifications.filter(n => !n.isRead).length;
        this.unreadCountSubject.next(unreadCount);
    }
}
