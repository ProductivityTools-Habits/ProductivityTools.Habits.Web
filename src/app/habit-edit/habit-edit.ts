import { Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HabitsService } from '../habits/habits.service';


@Component({
  selector: 'app-habit-edit',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './habit-edit.html',
  styleUrl: './habit-edit.css'
})
export class HabitEdit {

  constructor(private habitService: HabitsService) {

  }

  @Input() name: string = 'habit name';

  onSave() {
    this.habitService.saveHabit(this.name);
  }
}
