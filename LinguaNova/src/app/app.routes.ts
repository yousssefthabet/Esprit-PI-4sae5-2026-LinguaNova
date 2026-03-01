import { Routes, RouterModule, UrlSegment, UrlMatchResult } from '@angular/router';
import { apiInterceptor } from './core/interceptors/api.interceptor';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models/user.model';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./layout/main-layout/main-layout.component')
            .then(m => m.MainLayoutComponent),
        children: [
            {
                path: '',
                redirectTo: 'auth/login',
                pathMatch: 'full'
            },

            {
                path: 'about',
                loadComponent: () => import('./features/about/about.component')
                    .then(m => m.AboutComponent)
            },
            {
                path: 'auth/login',
                loadComponent: () => import('./features/auth/login/login.component')
                    .then(m => m.LoginComponent)
            },
            {
                path: 'auth/register',
                loadComponent: () => import('./features/auth/register/register.component')
                    .then(m => m.RegisterComponent)
            },
            {
                path: 'courses',
                children: [
                    {
                        path: 'course-creation',
                        loadComponent: () => import('./features/courses/course-creation/course-creation.component')
                            .then(m => m.CourseCreationComponent),
                        canActivate: [authGuard, roleGuard],
                        data: { role: UserRole.INSTRUCTOR }
                    },
                    {
                        path: 'edit/:id',
                        loadComponent: () => import('./features/courses/course-creation/course-creation.component')
                            .then(m => m.CourseCreationComponent),
                        canActivate: [authGuard, roleGuard],
                        data: { role: UserRole.INSTRUCTOR }
                    },
                    {
                        path: 'my-courses',
                        loadComponent: () => import('./features/courses/my-courses/my-courses.component')
                            .then(m => m.MyCoursesComponent),
                        canActivate: [authGuard]
                    },
                    {
                        path: 'instructor-courses',
                        loadComponent: () => import('./features/courses/instructor-courses/instructor-courses.component')
                            .then(m => m.InstructorCoursesComponent),
                        canActivate: [authGuard, roleGuard],
                        data: { role: UserRole.INSTRUCTOR }
                    },
                    {
                        path: 'course-flow',
                        loadComponent: () => import('./features/courses/course-flow/course-flow.component')
                            .then(m => m.CourseFlowComponent)
                    },
                    {
                        matcher: (url: UrlSegment[]): UrlMatchResult | null => {
                            if (url.length === 1 && !['course-creation', 'search', 'my-courses', 'instructor-courses', 'course-flow'].includes(url[0].path)) {
                                return { consumed: url, posParams: { id: url[0] } };
                            }
                            return null;
                        },
                        loadComponent: () => import('./features/courses/course-detail/course-detail.component')
                            .then(m => m.CourseDetailComponent)
                    },
                    {
                        path: '',
                        loadComponent: () => import('./features/courses/course-list/course-list.component')
                            .then(m => m.CourseListComponent)
                    }
                ]
            },

            {
                path: 'dashboard/student',
                loadComponent: () => import('./features/dashboard/student-dashboard/student-dashboard.component')
                    .then(m => m.StudentDashboardComponent),
                canActivate: [authGuard]
            },
            {
                path: 'dashboard/instructor',
                loadComponent: () => import('./features/dashboard/instructor-dashboard/instructor-dashboard.component')
                    .then(m => m.InstructorDashboardComponent),
                canActivate: [authGuard, roleGuard],
                data: { role: UserRole.INSTRUCTOR }
            },
            {
                path: 'profile/student',
                loadComponent: () => import('./features/profile/student-profile/student-profile.component')
                    .then(m => m.StudentProfileComponent),
                canActivate: [authGuard]
            },
            {
                path: 'profile/instructor',
                loadComponent: () => import('./features/profile/instructor-profile/instructor-profile.component')
                    .then(m => m.InstructorProfileComponent),
                canActivate: [authGuard, roleGuard],
                data: { role: UserRole.INSTRUCTOR }
            },
            {
                path: 'live-class/:id',
                loadComponent: () => import('./features/live-class/live-class.component')
                    .then(m => m.LiveClassComponent),
                canActivate: [authGuard]
            },
            {
                path: 'events',
                loadComponent: () => import('./features/events/event-list/event-list.component')
                    .then(m => m.EventListComponent)
            },
            {
                path: 'event/create',
                loadComponent: () => import('./features/events/event-creation/event-creation.component')
                    .then(m => m.EventCreationComponent),
                canActivate: [authGuard]
            },
            {
                path: 'calendar',
                loadComponent: () => import('./features/calendar/calendar.component')
                    .then(m => m.CalendarComponent)
            },
            {
                path: 'checkout',
                loadComponent: () => import('./features/checkout/checkout.component')
                    .then(m => m.CheckoutComponent),
                canActivate: [authGuard]
            },
            {
                path: 'pricing',
                loadComponent: () => import('./features/pricing/pricing.component')
                    .then(m => m.PricingComponent)
            },
            {
                path: 'clubs',
                loadComponent: () => import('./features/clubs/clubs.component')
                    .then(m => m.ClubsComponent)
            },

        ]
    },
    {
        path: 'admin',
        redirectTo: 'admin/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'admin/dashboard',
        loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component')
            .then(m => m.AdminDashboardComponent),
        canActivate: [authGuard, roleGuard],
        data: { role: UserRole.ADMIN }
    },
    {
        path: '**',
        redirectTo: ''
    }
];
