export interface DailyReading {
    id: string;
    createdAt: string;
    firstReading: string;
    secondReading: string;
    psalm: string;
    gospel: string;
}

export interface NewDailyReading {
    firstReading: string;
    secondReading: string;
    psalm: string;
    gospel: string;
}