import { TestBed } from '@angular/core/testing';
import { Apollo, QueryRef } from 'apollo-angular';
import { BehaviorSubject, of } from 'rxjs';


import { HabitsService } from './habits.service';
import { mock } from 'node:test';
import { NetworkStatus } from '@apollo/client/core';


interface MockApolloService {
  watchQuery<T>(options: any): QueryRef<T>;
}

describe('HabitsService', () => {
  let service: HabitsService;
  let mockApollo: MockApolloService

  let mockValueChangesSubject: BehaviorSubject<any>;


  beforeEach(() => {

    mockValueChangesSubject = new BehaviorSubject({
      data: { getHabits: [] },
      loading: false,
      NetworkStatus: 7
    });

    mockApollo = {
      watchQuery: <T>(options: any): QueryRef<T> => {
        return {
          valueChanges: mockValueChangesSubject.asObservable()
        } as QueryRef<T>;
      }
    }

    TestBed.configureTestingModule({
      providers: [
        HabitsService,
        { provide: Apollo, useValue: mockApollo }
      ]
    });
    service = TestBed.inject(HabitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
