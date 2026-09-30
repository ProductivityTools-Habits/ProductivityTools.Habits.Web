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

        // Group executions by day (yyyy-MM-dd)
        const byDay = new Map<string, any[]>();
        data[1].forEach(execution => {
          const key = this.toDayKey(new Date(execution.date));
          const list = byDay.get(key);
          if (list) {
            list.push(execution);
          } else {
            byDay.set(key, [execution]);
          }
        });

        // Build a continuous range of days from the oldest execution up to today,
        // so days without any execution are still visible in the history.
        this.historyView = [];
        if (byDay.size > 0) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const sortedKeys = Array.from(byDay.keys()).sort();
          const start = new Date(sortedKeys[0]);
          start.setHours(0, 0, 0, 0);
          const newest = new Date(sortedKeys[sortedKeys.length - 1]);
          newest.setHours(0, 0, 0, 0);
          const end = newest > today ? newest : today;

          for (const d = new Date(end); d >= start; d.setDate(d.getDate() - 1)) {
            const key = this.toDayKey(d);
            this.historyView.push({ date: key, executions: byDay.get(key) ?? [] });
          }
        }

        console.log("executions history data:", data);
        console.log("executions history view:", this.historyView);
      })
    )
  }

  private toDayKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getExecutionStatus(executions: any[], habitId: number): string {
    const execution = executions.find(e => e.habit.id === habitId);
    return execution ? execution.status : '';
  }
}
