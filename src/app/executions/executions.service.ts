import { Apollo, QueryRef } from "apollo-angular";
import { Execution } from "../models/execution";
import { GET_EXECUTIONS, COMPLETE_EXECUTION, SKIP_EXECUTION, RESET_EXECUTION, FAIL_EXECUTION } from "../graphql/graphql.queries";
import { map, Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ExecutionService {
    private executionQueryRef: QueryRef<{ getExecutions: Execution[] }>;

    constructor(private apollo: Apollo) {
        this.executionQueryRef = this.apollo.watchQuery<{ getExecutions: Execution[] }>({
            query: GET_EXECUTIONS,
            fetchPolicy: 'cache-and-network'
        });
    }

    getExecutionsObservable(): Observable<Execution[]> {
        return this.executionQueryRef.valueChanges.pipe(map(result => result.data.getExecutions));
    }

    onComplete(executionid: Number, date: string): Observable<any> {
        console.log("completing", executionid)
        return this.apollo.mutate({
            mutation: COMPLETE_EXECUTION,
            variables: { id: executionid, date: date },
            refetchQueries: [{ query: GET_EXECUTIONS }]
        });
    }
    onSkip(executionid: Number, date: string): Observable<any> {
        console.log("skipping", executionid)
        return this.apollo.mutate({
            mutation: SKIP_EXECUTION,
            variables: { id: executionid, date: date },
            refetchQueries: [{ query: GET_EXECUTIONS }]
        })
    }

        onReset(executionid: Number, date: string): Observable<any> {
        console.log("resseting", executionid)
        return this.apollo.mutate({
            mutation: RESET_EXECUTION,
            variables: { id: executionid, date: date },
            refetchQueries: [{ query: GET_EXECUTIONS }]
        })
    }

        onFailed(executionid: Number, date: string): Observable<any> {
        console.log("FAILING", executionid)
        return this.apollo.mutate({
            mutation: FAIL_EXECUTION,
            variables: { id: executionid, date: date },
            refetchQueries: [{ query: GET_EXECUTIONS }]
        })
    }
}