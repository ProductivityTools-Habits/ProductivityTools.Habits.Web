import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExecutionService } from '../executions.service';
import { HabitsService } from '../../habits/habits.service';
import { combineLatest, Subscription } from 'rxjs';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-execution-history',
  imports: [CommonModule],
  templateUrl: './execution-history.html',
  styleUrl: './execution-history.css'
})
export class ExecutionHistory implements OnInit, OnDestroy {

  historyView: any[] = [];
  habits: any[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private executionService: ExecutionService, private habitsService: HabitsService) {

  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadData(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = new Subscription();

    const executions$ = this.executionService.getExecutionsObservable();
    const habits$ = this.habitsService.getHabitsObservable();

    this.subscription.add(
      combineLatest([habits$, executions$]).subscribe(data => {
        this.habits = data[0];
        this.historyView = [];
        data[1].forEach(execution => {
          const day = this.historyView.find(item => item.date === execution.date);
          if (day) {
            day.executions.push(execution);
          } else {
            this.historyView.push({ date: execution.date, executions: [execution] });
          }
        })
        // Sort history by date descending
        this.historyView.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        console.log("executions history data:", data);
        console.log("executions history view:", this.historyView);
      })
    )
  }

  getExecutionStatus(executions: any[], habitId: number): string {
    const execution = executions.find(e => e.habit.id === habitId);
    return execution ? execution.status : '';
  }
}
