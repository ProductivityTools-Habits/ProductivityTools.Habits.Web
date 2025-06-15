export class Habit {
    name: string;
    id: number;
    done:boolean;

    constructor(id: number, name: string,done:boolean ) {
        this.id = id;
        this.name = name;
        this.done=done;
    }
}