import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'habits',
        loadComponent: () => import('./habits/habit-list/habit-list').then(m => m.HabitList)
    },
    {
        path: 'habit-edit/:id',
        loadComponent: () => import('./habit-edit/habit-edit').then(m => m.HabitEdit)
    },
    {
        path: 'habit-edit',
        loadComponent: () => import('./habit-edit/habit-edit').then(m => m.HabitEdit)
    },

    {
        path: 'execution',
        loadComponent: () => import('./executions/execution-list/execution-list').then(m => m.ExecutionList)
    },
    { path: '', redirectTo: '/habits', pathMatch: 'full' }
];
