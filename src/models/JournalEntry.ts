export interface JournalEntry {
    id: string;
    date: string;
    updatedAt: string;
    title: string;
    content: string;
}

export interface JournalEntryLite {
    id: string;
    createdAt: string;
    title: string;
}

export interface NewJournalEntry {
    title: string;
    content: string;
}

export interface UpdateJournalEntry {
    title?: string;
    content?: string;
}