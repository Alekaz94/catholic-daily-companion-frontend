import { AuditLogDto } from "./AuditLog";
import { UserDto } from "./User";

export interface AdminUserOverviewDto {
    user: UserDto;
    journalCount: number;
    rosaryCount: number;
    rosaryDates: string[];
    auditLogs: AuditLogDto[];
}