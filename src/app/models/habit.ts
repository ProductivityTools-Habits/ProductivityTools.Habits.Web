export class Habit {
    id: number;
    name: string;
    shortName: string | null;

    constructor(id: number, name: string, shortName: string | null) {
        this.id = id;
        this.name = name;
        this.shortName = shortName;
    }
}