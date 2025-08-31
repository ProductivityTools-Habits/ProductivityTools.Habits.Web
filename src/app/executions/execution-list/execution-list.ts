import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { Execution } from '../../models/execution';
import { ExecutionService } from '../executions.service';
import { HabitsService } from '../../habits/habits.service';
import { Habit } from '../../models/habit';

@Component({
  selector: 'app-execution-list',
  imports: [CommonModule],
  templateUrl: './execution-list.html',
  styleUrl: './execution-list.css'
})
export class ExecutionList{

  executionView$: Observable<any[]>;

  constructor(private executionService: ExecutionService, private habitsService: HabitsService) {
    const executions$ = this.executionService.getExecutionsObservable();
    const habits$ = this.habitsService.getHabitsObservable();

    this.executionView$ = combineLatest([executions$, habits$]).pipe(
      map(([executions, habits]) => {
        if (!executions || !habits) {
          return [];
        }
        return executions.map(execution => {
          const habit = habits.find(h => h.id === execution.habit.id);
          return {
            ...execution,
            habitName: habit ? habit.name : 'Unknown Habit'
          };
        });
      })
    );
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
