import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent) },
      { path: 'examens', loadComponent: () => import('./pages/exams/exams-list.component').then((m) => m.ExamsListComponent) },
      { path: 'examens/nouveau', loadComponent: () => import('./pages/exam-form/exam-form.component').then((m) => m.ExamFormComponent) },
      { path: 'examens/:id/passer', loadComponent: () => import('./pages/exam-take/exam-take.component').then((m) => m.ExamTakeComponent) },
      { path: 'examens/:id/modifier', loadComponent: () => import('./pages/exam-form/exam-form.component').then((m) => m.ExamFormComponent) },
      { path: 'examens/copies/:submissionId', loadComponent: () => import('./pages/copy-detail/copy-detail.component').then((m) => m.CopyDetailComponent) },
      { path: 'examens/:id/copies', loadComponent: () => import('./pages/exam-copies/exam-copies.component').then((m) => m.ExamCopiesComponent) },
      { path: 'examens/:id', loadComponent: () => import('./pages/exam-detail/exam-detail.component').then((m) => m.ExamDetailComponent) },
      { path: 'mon-profil', loadComponent: () => import('./pages/profile/profile.component').then((m) => m.ProfileComponent) },
      { path: 'mes-resultats', loadComponent: () => import('./pages/results/results.component').then((m) => m.ResultsComponent) },
    ],
  },
  { path: '**', redirectTo: '' },
];
