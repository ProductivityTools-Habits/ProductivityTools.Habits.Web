import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HabitList } from './habit-list';
import { Observable, of } from 'rxjs';
import { Habit } from '../../models/habit';
import { HabitsService } from '../habits.service';
import { DebugElement } from '@angular/core';



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

  it('should contain table', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('table')).toBeTruthy();
  })

  it('rows', () => {

    const bannerElemnt =fixture.nativeElement;
    const p=bannerElemnt.querySelector('p')!;
    expect(p.textContent).toEqual('habit-list works!')

    const bannerDe:DebugElement = fixture.debugElement
    const tableDe=bannerDe.query(By.css('.habit-list-table'))
    const table=tableDe.nativeElement;
    
    expect(table.rows.length).toEqual(1);
  
  })
});

describe('HabitListValues', () => {
  it('testing table values', () => {
    expect(true).toBeTruthy();
  })
});