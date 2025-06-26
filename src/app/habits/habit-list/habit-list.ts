import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Habit } from '../../models/habit';
import { HabitsService } from '../habits.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-habit-list',
  imports: [CommonModule],
  templateUrl: './habit-list.html',
  styleUrl: './habit-list.css'
})
export class HabitList {
  habits: Habit[];
  habits$: Observable<Habit[]> | undefined;

  constructor(private habitsService: HabitsService) {
    this.habits = this.habitsService.getHabits() ?? [];
    console.log("foreach")
    this.habits.forEach((habit) => {
      console.log(habit);
    })

    this.habits$ = this.habitsService.getHabitsObservable();
    console.log("habits1")
    console.log("habits1",this.habits$);
    // this.habits$.forEach((habit) => {
    //   console.log("habits2")
    //   console.log(habit);
    // })
    //console.log(this.habits);
  }
}
