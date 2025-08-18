import { NewSaint, Saint, UpdatedSaint } from "../models/Saint";
import { Page } from "../models/Page";
import API from "./api";

const endpoint = "/api/v1/saint";

export const getAllSaints = async (page: number, size: number): Promise<any> => {
    const res = await API.get(`${endpoint}?page=${page}&size=${size}`);
    return res.data;
}

export const searchSaints = async (query: string, page: number, size: number): Promise<Page<Saint>> => {
    const res = await API.get(`${endpoint}`, {params: {query, page, size}});
    return res.data;
}

export const getSpecificSaint = async (id: string): Promise<Saint> => {
    const res = await API.get<Saint>(`${endpoint}/${id}`);
    return res.data;
}

export const getSaintOfTheDay = async (): Promise<Saint> => {
    const res = await API.get<Saint>(`${endpoint}/today`);
    return res.data;
}

export const createSaint = async (saint: NewSaint): Promise<Saint> => {
    const res = await API.post<Saint>(endpoint, saint);
    return res.data;
}

export const updateSaint = async (id: string, updatedSaint: UpdatedSaint): Promise<Saint> => {
    const res = await API.put<Saint>(`${endpoint}/${id}`, updatedSaint);
    return res.data;
}

export const deleteSaint = async (id: string): Promise<void> => {
    await API.delete(`${endpoint}/${id}`);
}