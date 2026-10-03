export class DayStatus {
    id: number;
    date: string;
    status: string;
    reason: string | null;

    constructor(id: number, date: string, status: string, reason: string | null) {
        this.id = id;
        this.date = date;
        this.status = status;
        this.reason = reason;
    }
}
