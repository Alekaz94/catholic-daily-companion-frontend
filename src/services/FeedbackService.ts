import { FeedbackRequest } from "../models/Feedback";
import API from "./api";

const endpoint = "/api/v1/feedback"

export const sendFeedback = async (feedback: FeedbackRequest): Promise<void> => {
    await API.post(endpoint, feedback);
};