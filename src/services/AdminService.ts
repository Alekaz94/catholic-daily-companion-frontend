import { AdminUserOverviewDto } from "../models/AdminOverView";
import API from "./api";

const endpoint = "/api/v1/admin";

export const getUserOverview = async (userId: string): Promise<AdminUserOverviewDto> => {
    const response = await API.get<AdminUserOverviewDto>(`${endpoint}/users/${userId}/overview`)
    return response.data;
}