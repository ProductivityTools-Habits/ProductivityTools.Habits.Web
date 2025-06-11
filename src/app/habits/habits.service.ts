import { Injectable } from '@angular/core';
import { Habit } from './../models/habit'

@Injectable({
  providedIn: 'root'
})
export class HabitsService {

  habits: Habit[] = [
    { name: 'Pompki' },
    { name: 'Czytanie' }
  ]
  constructor() { }

  getHabits() {
    return this.habits;
  }
}
