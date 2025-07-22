export interface Saint {
    id: string;
    name: string;
    birthYear: number;
    deathYear: number;
    feastDay: string | null;
    biography: string;
    patronage: string;
    canonizationYear: number;
    imageUrl: string | null;
}

export interface NewSaint {
    name: string;
    birthYear: number;
    deathYear: number;
    feastDay: string;
    biography: string;
    patronage: string;
    canonizationYear: number;
    imageUrl: string;
}