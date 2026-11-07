export class Habit {
    id: number;
    name: string;
    shortName: string | null;
    /** yyyy-MM-dd; day the habit was created. */
    createdAt: string | null;

    constructor(id: number, name: string, shortName: string | null, createdAt: string | null = null) {
        this.id = id;
        this.name = name;
        this.shortName = shortName;
        this.createdAt = createdAt;
    }
}
