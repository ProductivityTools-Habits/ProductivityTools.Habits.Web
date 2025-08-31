import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, combineLatest, map } from 'rxjs';
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
export class ExecutionList implements OnInit, OnDestroy {

  executionView: any[] = []
  private subscription: Subscription = new Subscription();

  constructor(private executionService: ExecutionService, private habitsService: HabitsService) { }
  ngOnInit(): void {
    const executions$ = this.executionService.getExecutionsObservable();
    const habits$ = this.habitsService.getHabitsObservable();

    // const sub=executions$.subscribe(items=>{
    //   console.log("items", items)
    // })
    // this.subscription.add(sub);


    this.subscription.add(
      combineLatest([habits$,executions$]).pipe(
        map(([habits,executions ]) => {
          if (!habits || !executions) {
            return [];
          }
          return habits.map(habit => {
            const execution = executions.find(execution => habit.id === execution.habit.id);
            return { ...habit, executionStatus: execution?.status };
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

}
