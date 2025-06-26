import { Injectable } from '@angular/core';
import { Habit } from './../models/habit'

import { Apollo, QueryRef } from 'apollo-angular';
import { GET_HABIT } from '../graphql/graphql.queries';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HabitsService {

  habits: Habit[] = [];


  private habitQueryRef: QueryRef<{ getHabits: Habit[] }>;

  constructor(private apollo: Apollo) {
    // const { loading, error, data } = useQuery(GET_HABIT);
    this.habitQueryRef = this.apollo.watchQuery<{ getHabits: Habit[] }>({
      query: GET_HABIT,
      fetchPolicy: 'cache-and-network'
    });

    
    this.apollo.query<any>({
      query: GET_HABIT,
    }).subscribe({
      next: (result) => {
        console.log("result", result);
        this.habits = result.data.getHabits;
        console.log("this.habits", this.habits);
      },
    })
  }

  getHabitsObservable(): Observable<Habit[]> {
    return this.habitQueryRef.valueChanges.pipe(map(result => result.data.getHabits));
  }


  getHabits(): Habit[] | null {
    //const { loading, error, data } = useQuery(GET_HABIT);
    //let x= this.habitQueryRef.valueChanges.pipe(map(result => result.data.habits));
    // let x = data;
    //console.log(x);
    //return null;
    console.log("getHabits")
    console.log(this.habits);
    return this.habits;
  }

  // setExecutionStatus(habit: Habit, status: boolean) {
  //   const habitToUpdate = this.habits.find(h => h.id === habit.id);
  //   if (habitToUpdate) {
  //     habitToUpdate.done = status;
  //   }
  // }
}
