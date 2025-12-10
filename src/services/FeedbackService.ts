import { Feedback, FeedbackRequest, FeedbackUpdate } from "../models/Feedback";
import API from "./api";

const endpoint = "/api/v1/feedback"

export const sendFeedback = async (feedback: FeedbackRequest): Promise<Feedback> => {
    const res = await API.post(endpoint, feedback);
    return res.data;
};

export const getAllFeedback = async (page = 0, size = 10, sort = "desc") => {
    const response = await API.get(`${endpoint}?page=${page}&size=${size}&sort=${sort}`);
    return response.data;
};

export const getSpecificFeedback = async (id: string): Promise<Feedback> => {
    const res = await API.get(`${endpoint}/${id}`);
    return res.data;
}

export const updateFeedback = async (id: string, update: FeedbackUpdate): Promise<Feedback> => {
    const res = await API.put(`${endpoint}/${id}`, update);
    return res.data;
}