import { Page } from "../models/Page";
import { NewUser, User } from "../models/User";
import API from "./api";

const endpoint = "/api/v1/user"

export const changePassword = async (id: string, passwords: { currentPassword: string; newPassword: string }
): Promise<User> => {
    return await API.put(`${endpoint}/${id}`, passwords);
}

export const updateName = async (id: string, names: { firstName?: string, lastName?: string}): Promise<User> => {
    try {
        const result = await API.put(`${endpoint}/update-name/${id}`, names);
        return result.data;
    } catch (error) {
        console.error("Failed to update users name:", error);
        throw error;
    }
}

export const getAllUsers = async (page: number, size: number): Promise<any> => {
    const result = await API.get(`${endpoint}?page=${page}&size=${size}`);
    return result.data;
}

export const searchUser = async (query: string, page: number, size: number): Promise<Page<User[]>> => {
    const result = await API.get(`${endpoint}`, {params: {query, page, size}});
    return result.data;
}

export const createUser = async (user: NewUser): Promise<User> => {
    const result = await API.post(endpoint, user);
    return result.data;
}

export const deleteUser = async (id: string): Promise<void> => {
    await API.delete(`${endpoint}/${id}`);
}