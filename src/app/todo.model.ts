export interface Todo {
    /** findIndex */
    id: number;

    /** 工作名稱 */
    name: string;

    /** 完成與否 */
    completed: boolean;
}

export class UtilsTodo {
    static accept(todo: Todo, filter: string) {
        switch (filter.toUpperCase()) {
            case "ACTIVE":
                return !todo.completed;
            case "COMPLETED":
                return todo.completed;
            default:
                return true;
        }
    }
}