import { Injectable } from "@angular/core";
import { Apollo, QueryRef } from "apollo-angular";
import { map, Observable } from "rxjs";
import { DayStatus } from "../models/day-status";
import { GET_DAY_STATUSES, SKIP_DAY, FAIL_DAY, RESET_DAY } from "../graphql/graphql.queries";

@Injectable({
    providedIn: 'root'
})
export class DayStatusService {
    private queryRef: QueryRef<{ getDayStatuses: DayStatus[] }>;

    constructor(private apollo: Apollo) {
        this.queryRef = this.apollo.watchQuery<{ getDayStatuses: DayStatus[] }>({
            query: GET_DAY_STATUSES,
            fetchPolicy: 'cache-and-network'
        });
    }

    getDayStatusesObservable(): Observable<DayStatus[]> {
        return this.queryRef.valueChanges.pipe(map(result => result.data.getDayStatuses));
    }

    skipDay(date: string, reason: string): Observable<any> {
        return this.apollo.mutate({
            mutation: SKIP_DAY,
            variables: { date, reason },
            refetchQueries: [{ query: GET_DAY_STATUSES }]
        });
    }

    failDay(date: string, reason: string | null = null): Observable<any> {
        return this.apollo.mutate({
            mutation: FAIL_DAY,
            variables: { date, reason },
            refetchQueries: [{ query: GET_DAY_STATUSES }]
        });
    }

    resetDay(date: string): Observable<any> {
        return this.apollo.mutate({
            mutation: RESET_DAY,
            variables: { date },
            refetchQueries: [{ query: GET_DAY_STATUSES }]
        });
    }
}
