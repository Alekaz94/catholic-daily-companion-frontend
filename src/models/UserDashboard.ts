import { Feedback } from "./Feedback";

export interface UserDashboard {
    journalEntryCount: number;
    rosaryLogCount: number;
    feedbackCount: number;
    recentFeedbacks?: {
        content: Feedback[];
    };
    currentStreak: number;
    highestStreak: number;
}