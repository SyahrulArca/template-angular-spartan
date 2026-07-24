import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
    canActivate: [guestGuard],
    title: 'Login',
  },
  {
    path: '',
    loadComponent: () => import('./layout/app-shell/app-shell').then((m) => m.AppShell),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
        title: 'Dashboard',
        data: { breadcrumb: 'Dashboard' },
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./features/tasks/pages/task-page/task-page').then((m) => m.TaskPage),
        title: 'Tasks',
        data: { breadcrumb: 'Tasks' },
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings').then((m) => m.Settings),
        title: 'Settings',
        data: { breadcrumb: 'Settings' },
      },
      {
        path: '**',
        loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
        title: 'Not Found',
        data: { breadcrumb: 'Not Found' },
      },
    ],
  },
];
