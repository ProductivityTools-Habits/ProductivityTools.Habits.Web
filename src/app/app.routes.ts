import { Routes } from '@angular/router';
import { HabitList } from './habits/habit-list/habit-list';
import { HabitExecution } from './habits/habit-execution/habit-execution';

export const routes: Routes = [
    { path: 'habits', component: HabitList },
    { path: 'execution', component: HabitExecution },
    { path: '', redirectTo: '/habits', pathMatch: 'full' }
];
