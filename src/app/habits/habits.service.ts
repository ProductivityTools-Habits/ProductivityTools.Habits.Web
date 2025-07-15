import { Injectable } from '@angular/core';
import { Habit } from './../models/habit'

import { Apollo, QueryRef } from 'apollo-angular';
import { GET_HABIT, ADD_HABIT } from '../graphql/graphql.queries';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HabitsService {

  private habitQueryRef: QueryRef<{ getHabits: Habit[] }>;

  constructor(private apollo: Apollo) {
    this.habitQueryRef = this.apollo.watchQuery<{ getHabits: Habit[] }>({
      query: GET_HABIT,
      fetchPolicy: 'cache-and-network'
    });
  }

  getHabitsObservable(): Observable<Habit[]> {
    return this.habitQueryRef.valueChanges.pipe(map(result => result.data.getHabits));
  }

  saveHabit(name: string): void {
    this.apollo.mutate({
      mutation: ADD_HABIT,
      variables: { name: name },
      refetchQueries: [{ query: GET_HABIT }]
    }).subscribe({
      next: (response) => console.log("Habit saved sucessfully", response),
      error: (error) => console.error("error saving habit", error)
    })
  }

  // setExecutionStatus(habit: Habit, status: boolean) {
  //   const habitToUpdate = this.habits.find(h => h.id === habit.id);
  //   if (habitToUpdate) {
  //     habitToUpdate.done = status;
  //   }
  // }
}
