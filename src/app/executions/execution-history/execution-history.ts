import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExecutionService } from '../executions.service';
import { HabitsService } from '../../habits/habits.service';
import { combineLatest, Subscription } from 'rxjs';



@Component({
  selector: 'app-execution-history',
  imports: [],
  templateUrl: './execution-history.html',
  styleUrl: './execution-history.css'
})
export class ExecutionHistory implements OnInit, OnDestroy {

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

    const executions$=this.executionService.getExecutionsObservable();
    const habits$=this.habitsService.getHabitsObservable();

    this.subscription.add(
      combineLatest([habits$,executions$]).subscribe(data=>{
        console.log("executions history data:",data);
      })
    )
  }
}
