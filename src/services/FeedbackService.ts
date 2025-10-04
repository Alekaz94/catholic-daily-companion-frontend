import { Feedback, FeedbackRequest } from "../models/Feedback";
import API from "./api";

const endpoint = "/api/v1/feedback"

export const sendFeedback = async (feedback: FeedbackRequest): Promise<Feedback> => {
    const res = await API.post(endpoint, feedback);
    return res.data;
};

export const getAllFeedback = async (): Promise<Feedback[]> => {
    const res = await API.get(endpoint);
    return res.data;
}

export const getSpecificFeedback = async (id: string): Promise<Feedback> => {
    const res = await API.get(`${endpoint}/${id}`);
    return res.data;
}