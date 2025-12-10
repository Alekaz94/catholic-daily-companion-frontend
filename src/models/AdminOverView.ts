import { Feedback } from "./Feedback";
import { UserDto } from "./User";

export interface AdminUserOverviewDto {
    user: UserDto;
    feedbackCount: number;
    feedbacks: PageResponse<Feedback>;
}

export interface AdminUserList {
    id: string;
    email: string;
    role: string;
}

export interface PageResponse<T> {
    content: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}
  