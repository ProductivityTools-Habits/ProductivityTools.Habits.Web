import { Injectable } from '@angular/core';
import { Habit } from './../models/habit'

import { Apollo, QueryRef } from 'apollo-angular';
import { GET_HABITS, GET_HABIT, SAVE_HABIT } from '../graphql/graphql.queries';
import { Observable, map } from 'rxjs';
import { debug } from 'node:console';

@Injectable({
  providedIn: 'root'
})
export class HabitsService {

  private habitQueryRef: QueryRef<{ getHabits: Habit[] }>;

  constructor(private apollo: Apollo) {
    this.habitQueryRef = this.apollo.watchQuery<{ getHabits: Habit[] }>({
      query: GET_HABITS,
      fetchPolicy: 'cache-and-network'
    });
  }

  getHabitsObservable(): Observable<Habit[]> {
    return this.habitQueryRef.valueChanges.pipe(map(result => result.data.getHabits));
  }

  getHabit(id:number):Observable<Habit>{
    return this.apollo.query<{getHabit: Habit}>({
      query: GET_HABIT,
      variables: {id}
    }).pipe(map(result => result.data.getHabit))
    
  }

  saveHabit(habit: Habit): void {

    const habitInput={
      id: habit.id,
      name: habit.name
    }

    debugger;
    this.apollo.mutate({
      mutation: SAVE_HABIT,
      variables: { habit: habitInput },
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
