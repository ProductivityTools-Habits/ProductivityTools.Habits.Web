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

  constructor(private habitsService: HabitsService) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.habits = this.habitsService.getHabits();
  }

}
