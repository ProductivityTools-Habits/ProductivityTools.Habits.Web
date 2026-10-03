import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExecutionService } from '../executions.service';
import { DayStatusService } from '../day-status.service';
import { HabitsService } from '../../habits/habits.service';
import { DayStatus } from '../../models/day-status';
import { combineLatest, Subscription } from 'rxjs';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-execution-history',
  imports: [CommonModule, RouterLink],
  templateUrl: './execution-history.html',
  styleUrl: './execution-history.css'
})
export class ExecutionHistory implements OnInit, OnDestroy {

  historyView: any[] = [];
  habits: any[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private executionService: ExecutionService,
    private dayStatusService: DayStatusService,
    private habitsService: HabitsService
  ) {

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
    const dayStatuses$ = this.dayStatusService.getDayStatusesObservable();

    this.subscription.add(
      combineLatest([habits$, executions$, dayStatuses$]).subscribe(([habits, executions, dayStatuses]) => {
        this.habits = habits;

        // Group executions by day (yyyy-MM-dd)
        const byDay = new Map<string, any[]>();
        executions.forEach(execution => {
          const key = this.toDayKey(new Date(execution.date));
          const list = byDay.get(key);
          if (list) {
            list.push(execution);
          } else {
            byDay.set(key, [execution]);
          }
        });

        // Whole-day statuses keyed by day
        const dayStatusByDay = new Map<string, DayStatus>();
        (dayStatuses ?? []).forEach(s => dayStatusByDay.set(this.toDayKey(new Date(s.date)), s));

        // Build a continuous range of days from the oldest entry up to today,
        // so days without any execution are still visible in the history.
        this.historyView = [];
        const allKeys = Array.from(new Set([...byDay.keys(), ...dayStatusByDay.keys()])).sort();
        if (allKeys.length > 0) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const start = new Date(allKeys[0]);
          start.setHours(0, 0, 0, 0);
          const newest = new Date(allKeys[allKeys.length - 1]);
          newest.setHours(0, 0, 0, 0);
          const end = newest > today ? newest : today;

          for (const d = new Date(end); d >= start; d.setDate(d.getDate() - 1)) {
            const key = this.toDayKey(d);
            this.historyView.push({
              date: key,
              executions: byDay.get(key) ?? [],
              dayStatus: dayStatusByDay.get(key) ?? null
            });
          }
        }

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
