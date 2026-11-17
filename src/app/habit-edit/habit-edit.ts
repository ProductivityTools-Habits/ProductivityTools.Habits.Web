import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HabitsService } from '../habits/habits.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Habit } from '../models/habit';

@Component({
  selector: 'app-habit-edit',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './habit-edit.html',
  styleUrl: './habit-edit.css'
})
export class HabitEdit implements OnInit {

  habit: Habit = new Habit(-1, '', '');
  isEdit = false;
  isSaving = false;
  errorMessage = '';

  constructor(private habitService: HabitsService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      this.isEdit = !!id;
      if (id) {
        this.habitService.getHabit(Number(id)).subscribe({
          next: (habit) => {
            this.habit = { ...habit };
          },
          error: (error) => {
            console.error('error loading habit', error);
            this.errorMessage = 'Could not load habit.';
          }
        });
      }
    });
  }

  onSave(): void {
    const name = (this.habit.name ?? '').trim();
    if (!name || this.isSaving) {
      return;
    }
    this.isSaving = true;
    this.errorMessage = '';

    const toSave: Habit = {
      ...this.habit,
      name,
      shortName: (this.habit.shortName ?? '').trim()
    };

    this.habitService.saveHabit(toSave).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/habits']);
      },
      error: (error) => {
        console.error('error saving habit', error);
        this.isSaving = false;
        this.errorMessage = 'Could not save habit. Please try again.';
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/habits']);
  }
}
