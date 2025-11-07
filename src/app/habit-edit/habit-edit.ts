import { Component, input, Input, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HabitsService } from '../habits/habits.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs';
import { Habit } from '../models/habit';



@Component({
  selector: 'app-habit-edit',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './habit-edit.html',
  styleUrl: './habit-edit.css'
})
export class HabitEdit implements OnInit {

  constructor(private habitService: HabitsService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.habitService.getHabit(Number(id)).subscribe({
          next: (habit) => {
            this.habit = { ...habit }
          },
        })
      }
    }
    )
  }
  // habitId: Number = -1;
  // name: string = 'habit name';
  habit: Habit = new Habit(-1, '', '')

  onSave() {
    debugger;
    console.log("saving habit", this.habit);
    this.habitService.saveHabit(this.habit).subscribe({
      next: (response) => {
        this.router.navigate(['/habits']);
        console.log("Habit saved sucessfully", response)
      },
      error: (error) => console.error("error saving habit", error)
    })

  }

}
