export class Todo {
    /** 工作名稱 */
    name?: string;

    /** 完成與否 */
    completed: boolean;

    constructor() {
        this.completed = false;
    }
}