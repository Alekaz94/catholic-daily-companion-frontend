import { User, UserPasswordChange } from "../models/User";
import API from "./api";
import * as SecureStore from "expo-secure-store";

const endpoint = "/api/v1/user"

export const changePassword = async (id: string,   passwords: { currentPassword: string; newPassword: string }
): Promise<User> => {
    return await API.put(`${endpoint}/${id}`, passwords);
}