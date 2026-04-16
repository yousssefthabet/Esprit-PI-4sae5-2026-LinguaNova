import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LucideAngularModule, ShieldCheck, Layout, Users, GraduationCap, MessageSquare, Star, User, Activity, DollarSign, Settings, UserX, Trash2, CheckCircle, XCircle, Bell, BookOpen, TrendingUp, Search, LogOut, CreditCard, Lock } from 'lucide-angular';
import { apiInterceptor } from './core/interceptors/api.interceptor';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([apiInterceptor, authInterceptor, errorInterceptor])
    ),
    importProvidersFrom(
      LucideAngularModule.pick({
        ShieldCheck, Layout, Users, GraduationCap, MessageSquare, Star, User, Activity, DollarSign, Settings, UserX, Trash2, CheckCircle, XCircle, Bell, BookOpen, TrendingUp, Search, LogOut, CreditCard, Lock
      })
    )
  ]
};
