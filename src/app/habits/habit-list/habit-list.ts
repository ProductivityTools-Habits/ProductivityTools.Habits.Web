import {NgFor} from '@angular/common';
import { Component } from '@angular/core';
import { Habit } from '../../models/habit';
import { HabitsService } from '../habits.service';

@Component({
  selector: 'app-habit-list',
  imports: [NgFor],
  templateUrl: './habit-list.html',
  styleUrl: './habit-list.css'
})
export class HabitList {
  habits?: Habit[] | null;

  constructor(private habitsService: HabitsService) { 
     this.habits = this.habitsService.getHabits();
  }
}
