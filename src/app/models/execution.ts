import { Habit } from "./habit";

export class Execution{
    id:number;
    date:Date;
    status:string;
    habit:Habit;

    constructor(id:number, date:Date, status:string, habit:Habit){
        this.id=id;
        this.date=date;
        this.status=status;
        this.habit=habit
    }
}