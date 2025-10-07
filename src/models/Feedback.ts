export interface Feedback {
    id: string;
    category: string;
    message: string;
    email?: string;
    submittedAt?: string;
    isFixed: boolean;
}

export interface FeedbackRequest {
    category: string;
    message: string;
    email?: string;
}

export interface FeedbackUpdate {
    isFixed: boolean;
}