import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionHistory } from './execution-history';

describe('ExecutionHistory', () => {
  let component: ExecutionHistory;
  let fixture: ComponentFixture<ExecutionHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecutionHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutionHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
