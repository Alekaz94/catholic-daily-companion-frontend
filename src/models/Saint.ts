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
    imageAuthor: string | null;
    imageLicence: string | null;
    imageSource: string | null;
}

export interface NewSaint {
    name: string;
    birthYear: number;
    deathYear: number;
    feastDay: string | null;
    biography: string;
    patronage: string;
    canonizationYear: number;
    imageUrl?: string | null;
    imageSource?: string | null;
    imageAuthor?: string | null;
    imageLicence?: string | null;
}

export interface UpdatedSaint {
    name?: string;
    birthYear?: number;
    deathYear?: number;
    feastDay?: string;
    biography?: string;
    patronage?: string;
    canonizationYear?: number;
    imageUrl?: string | null;
    imageSource?: string | null;
    imageAuthor?: string | null;
    imageLicence?: string | null;
}