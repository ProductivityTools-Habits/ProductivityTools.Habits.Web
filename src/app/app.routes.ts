import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./auth/login/login').then(m => m.Login)
    },
    {
        path: 'habits',
        loadComponent: () => import('./habits/habit-list/habit-list').then(m => m.HabitList),
        canActivate: [authGuard]
    },
    {
        path: 'habit-edit/:id',
        loadComponent: () => import('./habit-edit/habit-edit').then(m => m.HabitEdit),
        canActivate: [authGuard]
    },
    {
        path: 'habit-edit',
        loadComponent: () => import('./habit-edit/habit-edit').then(m => m.HabitEdit),
        canActivate: [authGuard]
    },
    {
        path: 'execution',
        loadComponent: () => import('./executions/execution-list/execution-list').then(m => m.ExecutionList),
        canActivate: [authGuard]
    },
    {
        path: 'execution-history',
        loadComponent: () => import('./executions/execution-history/execution-history').then(m => m.ExecutionHistory),
        canActivate: [authGuard]
    },
    { path: '', redirectTo: '/execution', pathMatch: 'full' }
];
