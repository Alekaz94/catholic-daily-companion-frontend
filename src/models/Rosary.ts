export interface Rosary {
    id: string;
    date: string;
    completed: boolean;
}

interface PageResponse<T> {
    content: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}