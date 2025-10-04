export interface Feedback {
    id: string;
    category: string;
    message: string;
    email?: string;
    submittedAt?: string;
}

export interface FeedbackRequest {
    category: string;
    message: string;
    email?: string;
}