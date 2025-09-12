import API from "./api"
import { JournalEntry, NewJournalEntry, UpdateJournalEntry } from "../models/JournalEntry"

const endpoint = "/api/v1/journal-entry"

export const getAllEntries = async (page: number, size: number, sort: string): Promise<any> => {
    const res = await API.get(`${endpoint}?page=${page}&size=${size}&sort=${sort}`);
    return res.data;
};

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

export const  getJournalDates = async (): Promise<string[]> => {
    const result = await API.get(`${endpoint}/dates`);
    return result.data;
}

export const getJournalEntriesByDate = async (date: string): Promise<JournalEntry[] | null> => {
    const res = await API.get<JournalEntry[]>(`${endpoint}/dates/${date}`);
    return res.data;
};