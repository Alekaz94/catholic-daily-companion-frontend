import { User, UserPasswordChange } from "../models/User";
import API from "./api";
import * as SecureStore from "expo-secure-store";

const endpoint = "/api/v1/user"

export const changePassword = async (id: string, password: UserPasswordChange): Promise<User> => {
    const res = await API.put(`${endpoint}/${id}`, password);
    return res.data;
}