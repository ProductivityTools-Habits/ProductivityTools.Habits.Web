import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, combineLatest, map } from 'rxjs';
import { Execution } from '../../models/execution';
import { ExecutionService } from '../executions.service';
import { HabitsService } from '../../habits/habits.service';
import { Habit } from '../../models/habit';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-execution-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './execution-list.html',
  styleUrl: './execution-list.css'
})
export class ExecutionList implements OnInit, OnDestroy {

  executionView: any[] = []
  private subscription: Subscription = new Subscription();
  isNgModelChecked: boolean = false;
  date: string;


  constructor(private executionService: ExecutionService, private habitsService: HabitsService) {
    this.date = this.getDate();
  }
  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = new Subscription();

    const executions$ = this.executionService.getExecutionsObservable();
    const habits$ = this.habitsService.getHabitsObservable();

    this.subscription.add(

      combineLatest([habits$, executions$]).pipe(
        map(([habits, executions]) => {
          if (!habits || !executions) {
            return [];
          }
          return habits.map(habit => {
            console.log(executions);
            const execution = executions.find(execution => habit.id === execution.habit.id && this.formatDateToYYYYMMDD(new Date(execution.date)) === this.date);
            return { ...habit, executionId: execution?.id, executionStatus: execution?.status };
          });
        })
      ).subscribe(data => {
        this.executionView = data;
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private formatDateToYYYYMMDD(date: Date): string {
    // Get the year
    console.log("date", date)
    const year = date.getFullYear();

    // Get the month (0-11, so add 1) and pad with a leading zero if needed
    // Example: 9 becomes "09"
    const month = String(date.getMonth() + 1).padStart(2, '0');

    // Get the day of the month and pad with a leading zero if needed
    // Example: 9 becomes "09"
    const day = String(date.getDate()).padStart(2, '0');

    // Combine them with hyphens
    return `${year}-${month}-${day}`;
  }

  private getDate() {
    var r = this.formatDateToYYYYMMDD(new Date());
    return r;
  }

  public onComplete(id: number): void {
    var r = this.executionService.onComplete(Number(id), this.date).subscribe();
    console.log(id);
    console.log(r);
  }

  public onSkip(id: number): void {
    var r = this.executionService.onSkip(Number(id), this.date).subscribe();
    console.log(id);
  }

  public onReset(id: number): void {
    var r = this.executionService.onReset(Number(id), this.date).subscribe();
    console.log(id);
  }

  public onFailed(id: number): void {
    var r = this.executionService.onFailed(Number(id), this.date).subscribe();
    console.log(id);
  }
}
