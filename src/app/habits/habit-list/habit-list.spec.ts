import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitList } from './habit-list';
import { Observable, of } from 'rxjs';
import { Habit } from '../../models/habit';
import { HabitsService } from '../habits.service';



interface MockHabitListService {
  getHabitsObservable(): Observable<Habit[]>;
}

describe('HabitList', () => {
  let component: HabitList;
  let fixture: ComponentFixture<HabitList>;
  let mockHabitsService: MockHabitListService;
  let mockValueHabits: Habit[];


  beforeEach(async () => {

    mockValueHabits = [];

    mockHabitsService = {
      getHabitsObservable: (): Observable<Habit[]> => {
        return of(mockValueHabits);
      }
    }

    await TestBed.configureTestingModule({
      imports: [HabitList],
      providers: [{ provide: HabitsService, useValue: mockHabitsService }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HabitList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create1', () => {
    expect(component).toBeTruthy();
  });
});
