export interface Pagination {
    count: number;
    currentPage: number;
    pageSize: number;
}

export class UtilsPagination {
    static GetPageData<T>(data: T[], pagination: Pagination): T[] {
        let begin = pagination.pageSize * (pagination.currentPage - 1);
        let end = pagination.pageSize * pagination.currentPage;

        return data.slice(begin, end);
    }
}