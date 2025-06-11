import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitExecution } from './habit-execution';

describe('HabitExecution', () => {
  let component: HabitExecution;
  let fixture: ComponentFixture<HabitExecution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitExecution]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabitExecution);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
