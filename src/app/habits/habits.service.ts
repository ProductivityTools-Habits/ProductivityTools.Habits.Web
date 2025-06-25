import { Injectable } from '@angular/core';
import { Habit } from './../models/habit'

@Injectable({
  providedIn: 'root'
})
export class HabitsService {

  habits: Habit[] = [
    { id: 1, name: 'Pompki',  done: false },
    { id: 2, name: 'Czytanie', done: false }
  ]
  constructor() { }

  getHabits() {
    return this.habits;
  }

  setExecutionStatus(habit: Habit, status: boolean) {
    const habitToUpdate = this.habits.find(h => h.id === habit.id);
    if (habitToUpdate) {
      habitToUpdate.done = status;
    }
  }
}
