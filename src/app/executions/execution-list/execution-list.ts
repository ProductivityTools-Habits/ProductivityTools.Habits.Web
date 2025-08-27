import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Execution } from '../../models/execution';
import { ExecutionService } from '../executions.service';

@Component({
  selector: 'app-execution-list',
  imports: [CommonModule],
  templateUrl: './execution-list.html',
  styleUrl: './execution-list.css'
})
export class ExecutionList {

  executions$: Observable<Execution[]> | undefined;

  constructor(private executionService: ExecutionService) {
    this.executions$ = this.executionService.getExecutionsObservable();
    console.log("executions", this.executions$);
  }
}
