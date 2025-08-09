import { DailyReading, NewDailyReading } from "../models/DailyReading";
import API from "./api";

const endpoint = "/api/v1/daily-reading";

export const getAllDailyReadings = async (page: number, size: number): Promise<any> => {
    const res = await API.get(`${endpoint}?page=${page}&size=${size}`);
    return res.data;
}

export const getReadingById = async (id: string): Promise<DailyReading> => {
    const res = await API.get<DailyReading>(`${endpoint}/${id}`);
    return res.data;
}

export const getTodaysReading = async (): Promise<DailyReading> => {
    const res = await API.get<DailyReading>(`${endpoint}/today`)
    return res.data;
}

export const createDailyReading = async (dailyReading: NewDailyReading): Promise<DailyReading> => {
    const res = await API.post<DailyReading>(endpoint, dailyReading);
    return res.data;
}