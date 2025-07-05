import { Component, Input,NgModule } from '@angular/core';

@NgModule({
  selector: 'app-habit-edit',
  imports: [],
  templateUrl: './habit-edit.html',
  styleUrl: './habit-edit.css'
})
export class HabitEdit {

  @Input() name: string = 'habit name';
}
