import { NewSaint, Saint } from "../models/Saint";
import API from "./api";

const endpoint = "/api/v1/saint";

export const getAllSaints = async (): Promise<Saint[]> => {
    const res = await API.get<Saint[]>(endpoint);
    return res.data;
}

export const getSpecificSaint = async (id: string): Promise<Saint> => {
    const res = await API.get<Saint>(`${endpoint}/${id}`);
    return res.data;
}

export const createSaint = async (saint: NewSaint): Promise<Saint> => {
    const res = await API.post<Saint>(endpoint, saint);
    return res.data;
}