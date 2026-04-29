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
                path: 'dashboard/student/events',
                loadComponent: () => import('./features/events/student-joined-events/student-joined-events.component')
                    .then(m => m.StudentJoinedEventsComponent),
                canActivate: [authGuard, roleGuard],
                data: { role: UserRole.STUDENT }
            },
            {
                path: 'dashboard/instructor',
                loadComponent: () => import('./features/dashboard/instructor-dashboard/instructor-dashboard.component')
                    .then(m => m.InstructorDashboardComponent),
                canActivate: [authGuard, roleGuard],
                data: { role: UserRole.INSTRUCTOR }
            },
            {
                path: 'dashboard/instructor/events',
                loadComponent: () => import('./features/events/instructor-events/instructor-events.component')
                    .then(m => m.InstructorEventsComponent),
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
                path: 'event/edit/:id',
                loadComponent: () => import('./features/events/event-creation/event-creation.component')
                    .then(m => m.EventCreationComponent),
                canActivate: [authGuard]
            },
            {
                path: 'event/chat/:id',
                loadComponent: () => import('./features/events/event-chat/event-chat.component')
                    .then(m => m.EventChatComponent),
                canActivate: [authGuard]
            },
            {
                path: 'event/meet/:id',
                loadComponent: () => import('./features/events/event-meet/event-meet.component')
                    .then(m => m.EventMeetComponent),
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
                path: 'clubs/english-conversation',
                loadComponent: () => import('./features/clubs/english-conversation-club.component')
                    .then(m => m.EnglishConversationClubComponent)
            },
            {
                path: 'clubs/book-storytelling',
                loadComponent: () => import('./features/clubs/book-storytelling-club.component')
                    .then(m => m.BookStorytellingClubComponent)
            },
            {
                path: 'clubs/book-storytelling/:bookId',
                loadComponent: () => import('./features/clubs/book-reader.component')
                    .then(m => m.BookReaderComponent)
            },
            {
                path: 'clubs/drama-roleplay',
                loadComponent: () => import('./features/clubs/drama-roleplay-club.component')
                    .then(m => m.DramaRoleplayClubComponent)
            },
            {
                path: 'clubs/drama-roleplay/:scenarioId',
                loadComponent: () => import('./features/clubs/drama-roleplay-room.component')
                    .then(m => m.DramaRoleplayRoomComponent)
            },
            {
                path: 'clubs/writing-grammar',
                loadComponent: () => import('./features/clubs/writing-grammar-club.component')
                    .then(m => m.WritingGrammarClubComponent)
            },
            {
                path: 'clubs',
                loadComponent: () => import('./features/clubs/clubs.component')
                    .then(m => m.ClubsComponent)
            },
            {
                path: 'notes',
                loadComponent: () => import('./features/notes/notes.component')
                    .then(m => m.NotesComponent),
                canActivate: [authGuard]
            },
            {
                path: 'mes-notes',
                loadComponent: () => import('./features/notes/notes.component')
                    .then(m => m.NotesComponent),
                canActivate: [authGuard, roleGuard],
                data: { role: UserRole.STUDENT }
            },

            // ── Gestion des examens ──────────────────────────────────
            {
                path: 'examens',
                loadComponent: () => import('./features/exams/exams-list/exams-list.component')
                    .then(m => m.ExamsListComponent)
            },
            {
                path: 'examens/nouveau',
                loadComponent: () => import('./features/exams/exam-form/exam-form.component')
                    .then(m => m.ExamFormComponent)
            },
            {
                // Route statique avant la route dynamique :id
                path: 'examens/copies/:submissionId',
                loadComponent: () => import('./features/exams/copy-detail/copy-detail.component')
                    .then(m => m.CopyDetailComponent)
            },
            {
                path: 'examens/:id/passer',
                loadComponent: () => import('./features/exams/exam-take/exam-take.component')
                    .then(m => m.ExamTakeComponent)
            },
            {
                path: 'examens/:id/modifier',
                loadComponent: () => import('./features/exams/exam-form/exam-form.component')
                    .then(m => m.ExamFormComponent)
            },
            {
                path: 'examens/:id/copies',
                loadComponent: () => import('./features/exams/exam-copies/exam-copies.component')
                    .then(m => m.ExamCopiesComponent)
            },
            {
                path: 'examens/:id',
                loadComponent: () => import('./features/exams/exam-detail/exam-detail.component')
                    .then(m => m.ExamDetailComponent)
            },
            {
                path: 'mes-resultats',
                loadComponent: () => import('./features/exams/results/results.component')
                    .then(m => m.ResultsComponent)
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
        path: 'admin/clubs/:clubId/ai-dashboard',
        loadComponent: () => import('./features/admin/club-health-dashboard/club-health-dashboard.component')
            .then(m => m.ClubHealthDashboardComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
