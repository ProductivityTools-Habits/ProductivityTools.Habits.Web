export class Habit {
    id: number;
    name: string;
    shortName: string;

    constructor(id: number, name: string, shortName: string) {
        this.id = id;
        this.name = name;
        this.shortName = shortName;
    }
}