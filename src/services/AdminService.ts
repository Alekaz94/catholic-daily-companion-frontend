import { AdminUserList, AdminUserOverviewDto, PageResponse } from "../models/AdminOverView";
import { Feedback } from "../models/Feedback";
import API from "./api";

const endpoint = "/api/v1/admin";

interface PaginatedAdminUserList {
    content: AdminUserList[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export const getUserOverviewPaged = async (userId: string, feedbackPage = 0, feedbackSize = 10, feedbackSort = "desc"): Promise<AdminUserOverviewDto> => {
    const response = await API.get(`${endpoint}/users/${userId}/overview?feedbackPage=${feedbackPage}&feedbackSize=${feedbackSize}&feedbackSort=${feedbackSort}`);
    const data = response.data as any;

    const mappedFeedbacks: PageResponse<Feedback> = {
        content: data.feedbacks.content,
        pageNumber: data.feedbacks.number,
        pageSize: data.feedbacks.size,
        totalElements: data.feedbacks.totalElements,
        totalPages: data.feedbacks.totalPages,
        last: data.feedbacks.last,
    };

    return {
        user: data.user,
        feedbackCount: data.feedbackCount,
        feedbacks: mappedFeedbacks,
    };
};

export const getAdminUsers = async (page = 0, size = 10, sortBy = "email", sortDir = "asc", query = ""): Promise<PaginatedAdminUserList> => {
    const response = await API.get<PaginatedAdminUserList>(`${endpoint}/users?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}&query=${query}`);
    return response.data;
}