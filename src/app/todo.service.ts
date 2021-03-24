import { Injectable } from '@angular/core';
import { Todo, UtilsTodo } from './todo.model';
import { combineLatest, Observable, of } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { flatten } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todoUrl = "http://localhost:3000/todos";
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }


  /**
   * @typedef {Object} Todo
   * @property {number} id - id
   * @property {number} name - 代辦事項名稱
   * @property {boolean} completed - 已完成
   */

  /**
   * 取得代辦事項
   * @param filter 篩選條件(All/Active/Completed)
   * @param page 頁碼
   * @param limit 每頁筆數
   * @returns 符合條件之代辦事項
   */
  getTodos(filter: string, page: number, limit: number): Observable<Todo[]> {
    var url = `${this.todoUrl}?_page=${page}&_limit=${limit}`;

    switch (filter.toUpperCase()) {
      case "ACTIVE":
        url += "&completed=false";
        break;
      case "COMPLETED":
        url += "&completed=true";
        break;
    }

    return this.http.get<Todo[]>(url, this.httpOptions);
  }

  /**
   * @typedef {Object} Summary
   * @property {number} totalCount - 總筆數
   * @property {number} filteredCount - 篩選後比數(未分頁)
   * @property {number} remaining - 剩餘未完成數量
   * @property {number} completedCount - 已完成數量
   */
  /**
   * 取得摘要
   * @param filter 篩選條件(All/Active/Completed)
   * @returns {Summary} 摘要資訊
   */
  getSummary(filter: string): Observable<{ totalCount: number, filteredCount: number, remaining: number, compltedCount: number }> {
    return this.http
      .get<Todo[]>(this.todoUrl, this.httpOptions)
      .pipe(
        map(todos => ({
          totalCount: todos.length || 0,
          filteredCount: todos.filter(todo => UtilsTodo.accept(todo, filter)).length || 0,
          remaining: todos.filter(todo => !todo.completed).length || 0,
          compltedCount: todos.filter(todo => todo.completed).length || 0
        })
        )
      );
  }

  /**
   * 新增代辦事項
   * @param newTodo 代辦事項名稱
   * @returns 完成新增的代辦事項(含id)
   */
  add(newTodo: string): Observable<Todo> {
    return this.http.post<Todo>(
      this.todoUrl,
      { name: newTodo, completed: false },
      this.httpOptions
    ).pipe(
      tap(todo => console.log(todo))
    );
  }

  /**
   * 修改代辦事項
   * @param todo 待修改的代辦事項
   * @returns 修改後的代辦事項
   */
  update(todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.todoUrl}/${todo.id}`, todo, this.httpOptions).pipe(
      tap((todo) => console.log(todo))
    );
  }

  /**
   * 刪除指定代辦事項
   * @param id 欲刪除之索引
   * @returns 本次刪除之代辦事項
   */
  delete(id: number): Observable<Todo> {
    return this.http.delete<Todo>(`${this.todoUrl}/${id}`, this.httpOptions).pipe(
      tap((todo) => console.log(todo))
    );
  }

  /**
   * 勾選代辦事項
   * @param filter 篩選條件
   * @param page 頁碼
   * @param limit 每頁筆數
   * @param checked 已完成
   * @returns 本次修改清單
   */
  toggleAll(filter: string, page: number, limit: number, checked: boolean): Observable<Todo[]> {
    return this.getTodos(filter, page, limit).pipe(
      switchMap(todos => {
        let updates = todos.map(todo => {
          todo.completed = checked;

          return this.update(todo);
        });

        return combineLatest(updates);
      })
    )
  }

  /**
   * 清除已完成之代辦事項
   * @returns 本次修改清單
   */
  clearCompleted() {
    var url = `${this.todoUrl}?completed=true`;

    return this.http.get<Todo[]>(url, this.httpOptions).pipe(
      tap((todos) => todos.forEach(todo => this.delete(todo.id).subscribe()))
    );
  }
}