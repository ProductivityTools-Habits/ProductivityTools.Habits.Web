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
  // habits: Habit[];
  habits$: Observable<Habit[]> | undefined;

  constructor(private habitsService: HabitsService) {
    this.habits$ = this.habitsService.getHabitsObservable().pipe(map(habits => [...habits].sort((a, b) => a.id - b.id)));
    console.log("habits1", this.habits$);
  }
  public onDelete(habitId: Number) {
    var result=this.habitsService.deleteHabit(Number(habitId)).subscribe();
    console.log("deleting habit")
  }
}
