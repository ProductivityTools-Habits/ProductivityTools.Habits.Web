import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'habits',
        loadComponent: () => import('./habits/habit-list/habit-list').then(m => m.HabitList)
    },
    {
        path: 'habit-edit',
        loadComponent: () => import('./habit-edit/habit-edit').then(m => m.HabitEdit)
    },
    {
        path: 'execution',
        loadComponent: () => import('./habits/habit-execution/habit-execution').then(m => m.HabitExecution)
    },
    { path: '', redirectTo: '/habits', pathMatch: 'full' }
];
