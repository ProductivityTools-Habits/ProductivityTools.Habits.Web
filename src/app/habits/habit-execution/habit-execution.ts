import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HabitsService } from '../habits.service';
import { Habit } from '../../models/habit';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-habit-execution',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './habit-execution.html',
  styleUrl: './habit-execution.css'
})
export class HabitExecution {
  habits: Habit[];

  constructor(private habitsService: HabitsService) {
    this.habits = this.habitsService.getHabits() ??[];
  }

  // finish(habit: Habit, event:Event) {
  //   const target = event.target as HTMLInputElement;
  //   const isChecked = target.checked;
  //   console.log(habit, isChecked);
  //   this.habitsService.setExecutionStatus(habit, isChecked);
  // }
}
