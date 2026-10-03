import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, combineLatest, map } from 'rxjs';
import { Execution } from '../../models/execution';
import { ExecutionService } from '../executions.service';
import { DayStatusService } from '../day-status.service';
import { HabitsService } from '../../habits/habits.service';
import { Habit } from '../../models/habit';
import { DayStatus } from '../../models/day-status';
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
  private routeSubscription: Subscription = new Subscription();
  isNgModelChecked: boolean = false;
  date: string;
  showAdvancedPanel: boolean = false;

  /** Status of the whole selected day (Skipped/Failed), if any. */
  dayStatus: DayStatus | null = null;

  /** Skip-day reason dialog state */
  showSkipDayDialog: boolean = false;
  skipDayReason: string = '';


  constructor(
    private executionService: ExecutionService,
    private dayStatusService: DayStatusService,
    private habitsService: HabitsService,
    private route: ActivatedRoute
  ) {
    this.date = this.formatDateToYYYYMMDD(new Date());
  }
  ngOnInit(): void {
    // Allow opening a specific day via /execution?date=yyyy-MM-dd (e.g. from history)
    this.routeSubscription = this.route.queryParamMap.subscribe(params => {
      const dateParam = params.get('date');
      if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
        this.date = dateParam;
      }
      this.loadData();
    });
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

      combineLatest([habits$, executions$]).pipe(
        map(([habits, executions]) => {
          if (!habits || !executions) {
            return [];
          }
          return habits.map(habit => {
            console.log(executions);
            const execution = executions.find(execution => habit.id === execution.habit.id && this.formatDateToYYYYMMDD(new Date(execution.date)) === this.date);
            return {
              ...habit,
              executionId: execution?.id,
              executionStatus: execution?.status
            };
          });
        })
      ).subscribe(data => {
        this.executionView = data;
      })
    )

    this.subscription.add(
      dayStatuses$.subscribe(statuses => {
        this.dayStatus = (statuses ?? []).find(s => this.formatDateToYYYYMMDD(new Date(s.date)) === this.date) ?? null;
      })
    );
  }

  // ---- Whole-day status (Skip day / Fail day) ----

  public openSkipDayDialog(): void {
    this.skipDayReason = this.dayStatus?.status === 'Skipped' ? (this.dayStatus.reason ?? '') : '';
    this.showSkipDayDialog = true;
  }

  public cancelSkipDay(): void {
    this.showSkipDayDialog = false;
    this.skipDayReason = '';
  }

  public confirmSkipDay(): void {
    const reason = this.skipDayReason.trim();
    if (!reason) {
      return;
    }
    this.dayStatusService.skipDay(this.date, reason).subscribe();
    this.showSkipDayDialog = false;
    this.skipDayReason = '';
  }

  public onFailDay(): void {
    this.dayStatusService.failDay(this.date).subscribe();
  }

  public onResetDay(): void {
    this.dayStatusService.resetDay(this.date).subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.routeSubscription.unsubscribe();
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

  private getDateinDateFormat(): Date {
    const r: Date = new Date(this.date)
    //var r = this.formatDateToYYYYMMDD(dateToFromat);
    return r;
  }

  public previousDate() {
    debugger;
    var selectedDate = this.getDateinDateFormat();
    this.date = this.formatDateToYYYYMMDD(new Date(selectedDate.setDate(selectedDate.getDate() - 1)));
    this.loadData();
    console.log("Date:", this.date)
  }

  public nextDate() {
    var selectedDate = this.getDateinDateFormat();
    this.date = this.formatDateToYYYYMMDD(new Date(selectedDate.setDate(selectedDate.getDate() + 1)));
    this.loadData();
    console.log("Date:", this.date)

  }

  public today() {
    this.date = this.formatDateToYYYYMMDD(new Date());
    this.loadData();
    console.log("Date:", this.date)
  }

  /** Current date formatted for display as yyyy.MM.dd */
  get displayDate(): string {
    return this.date.replace(/-/g, '.');
  }

  /** Handle manual edit of the yyyy.MM.dd text field. */
  public onDisplayDateChange(input: HTMLInputElement): void {
    const match = /^(\d{4})[.\-/](\d{2})[.\-/](\d{2})$/.exec(input.value.trim());
    const iso = match ? `${match[1]}-${match[2]}-${match[3]}` : '';
    const parsed = match ? new Date(+match[1], +match[2] - 1, +match[3]) : new Date(NaN);
    const valid = !!match && !isNaN(parsed.getTime()) && this.formatDateToYYYYMMDD(parsed) === iso;
    if (!valid) {
      // Invalid input: snap back to the previous valid value
      input.value = this.displayDate;
      return;
    }
    this.date = iso;
    this.loadData();
  }

  /** Handle selection from the hidden native date picker (value is yyyy-MM-dd). */
  public onPickerChange(value: string): void {
    if (value) {
      this.date = value;
      this.loadData();
    }
  }

  public openPicker(picker: HTMLInputElement): void {
    if (typeof picker.showPicker === 'function') {
      picker.showPicker();
    } else {
      picker.click();
    }
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
