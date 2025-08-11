import { User } from "../models/User";
import API from "./api";

const endpoint = "/api/v1/user"

export const changePassword = async (id: string, passwords: { currentPassword: string; newPassword: string }
): Promise<User> => {
    return await API.put(`${endpoint}/${id}`, passwords);
}

export const getAllUsers = async (): Promise<User[]> => {
    const result = await API.get(`${endpoint}`);
    return result.data;
}