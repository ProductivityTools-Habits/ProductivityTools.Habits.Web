import { Component, Input,NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule } from '@angular/forms';


@Component({
  selector: 'app-habit-edit',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './habit-edit.html',
  styleUrl: './habit-edit.css'
})
export class HabitEdit {

  @Input() name: string = 'habit name';
}
