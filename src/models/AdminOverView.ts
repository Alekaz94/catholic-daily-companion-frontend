import { AuditLogDto } from "./AuditLog";
import { Feedback } from "./Feedback";
import { UserDto } from "./User";

export interface AdminUserOverviewDto {
    user: UserDto;
    journalCount: number;
    rosaryCount: number;
    feedbackCount: number;
    feedbacks: Feedback[];
    rosaryDates: string[];
    auditLogs: AuditLogDto[];
}