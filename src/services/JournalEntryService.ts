import API from "./api"
import { JournalEntry, NewJournalEntry, UpdateJournalEntry } from "../models/JournalEntry"

const endpoint = "/api/v1/journal-entry"

export const getAllEntries = async (): Promise<JournalEntry[]> => {
    const res = await API.get<JournalEntry[]>(endpoint);
    return res.data;
}

export const getSpecificEntry = async (id: string): Promise<JournalEntry> => {
    const res = await API.get<JournalEntry>(`${endpoint}/${id}`);
    return res.data;
}

export const createEntry = async (entry: NewJournalEntry): Promise<JournalEntry> => {
    const res = await API.post<JournalEntry>(endpoint, entry);
    return res.data;
}

export const updateEntry = async (id: string, entry: UpdateJournalEntry): Promise<JournalEntry> => {
    const res = await API.put<JournalEntry>(`${endpoint}/${id}`, entry);
    return res.data;
}

export const deleteEntry = async (id: string): Promise<void> => {
    await API.delete(`${endpoint}/${id}`);
}