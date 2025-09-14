import { Apollo, QueryRef } from "apollo-angular";
import { Execution } from "../models/execution";
import { GET_EXECUTIONS,COMPLETE_EXECUTION } from "../graphql/graphql.queries";
import { map, Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ExecutionService{
    private executionQueryRef: QueryRef<{ getExecutions: Execution[] }>;

    constructor(private apollo: Apollo){
        this.executionQueryRef = this.apollo.watchQuery<{ getExecutions: Execution[] }>({
            query: GET_EXECUTIONS,
            fetchPolicy: 'cache-and-network'
        });
    }

    getExecutionsObservable(): Observable<Execution[]> {
        return this.executionQueryRef.valueChanges.pipe(map(result => result.data.getExecutions));
    }

    onComplete(executionid:Number):Observable<any>{
        console.log("completing", executionid)
        return this.apollo.mutate({
            mutation:COMPLETE_EXECUTION,
            variables: {id: executionid},
            refetchQueries: [{ query: GET_EXECUTIONS }]
          });

    }
}