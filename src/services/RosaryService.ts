import { Rosary } from "../models/Rosary";
import API from "./api"

const endpoint = "/api/v1/rosary"

export const completeToday = async (userId: string): Promise<Rosary> => {
    const result = await API.post(`${endpoint}/${userId}/complete`);
    return result.data;
}

export const isCompletedToday = async (userId: string): Promise<boolean> => {
    const result = await API.post(`${endpoint}/${userId}/completed-today`);
    return result.data;
}

export const getHistory = async (userId: string): Promise<Rosary[]> => {
    const result = await API.get(`${endpoint}/${userId}/history`);
    return result.data;
}

export const getStreak = async (userId: string): Promise<number> => {
    const result = await API.get(`${endpoint}/${userId}/streak`);
    return result.data;
}

export const  getRosaryHistoryDates = async (userId: string): Promise<string[]> => {
    const result = await API.get(`${endpoint}/${userId}/rosary-dates`);
    return result.data;
}

export const isRosaryCompletedOn = async (userId: string, date: string): Promise<boolean> => {
    const res = await API.get<boolean>(`${endpoint}/${userId}/completed-on/${date}`);
    return res.data;
};