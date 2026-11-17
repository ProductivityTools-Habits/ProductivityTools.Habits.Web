import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Habit } from '../../models/habit';
import { HabitsService } from '../habits.service';
import { Observable, map } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-habit-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './habit-list.html',
  styleUrl: './habit-list.css'
})
export class HabitList {
  habits$: Observable<Habit[]>;

  constructor(private habitsService: HabitsService) {
    this.habits$ = this.habitsService.getHabitsObservable().pipe(
      map(habits => [...habits].sort((a, b) => a.id - b.id))
    );
  }

  public onDelete(habit: Habit): void {
    if (!confirm(`Delete habit "${habit.name}"?`)) {
      return;
    }
    this.habitsService.deleteHabit(Number(habit.id)).subscribe({
      error: (error) => console.error('error deleting habit', error)
    });
  }
}
