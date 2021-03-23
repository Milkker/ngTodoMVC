import { Injectable } from '@angular/core';
import { Todo } from './todo';
import { combineLatest, Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";



@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todoUrl = "http://localhost:3000/todos";
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

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

  getSummary(filter: string): Observable<{ totalCount: number, filteredCount: number, remaining: number, compltedCount: number }> {
    return this.http
      .get<Todo[]>(this.todoUrl, this.httpOptions)
      .pipe(
        map(todos => ({
          totalCount: todos.length || 0,
          filteredCount: todos.filter(todo => this.accept(todo, filter)).length || 0,
          remaining: todos.filter(todo => !todo.completed).length || 0,
          compltedCount: todos.filter(todo => todo.completed).length || 0
        })
        )
      );
  }

  accept(todo: Todo, filter: string) {
    switch (filter.toUpperCase()) {
      case "ACTIVE":
        return !todo.completed;
      case "COMPLETED":
        return todo.completed;
      default:
        return true;
    }
  }

  add(newTodo: string): Observable<Todo> {
    return this.http.post<Todo>(
      this.todoUrl,
      { name: newTodo, completed: false },
      this.httpOptions
    ).pipe(
      tap(todo => console.log(todo))
    );
  }

  update(todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.todoUrl}/${todo.id}`, todo, this.httpOptions).pipe(
      tap((todo) => console.log(todo))
    );
  }

  delete(id: number): Observable<Todo> {
    return this.http.delete<Todo>(`${this.todoUrl}/${id}`, this.httpOptions).pipe(
      tap((todo) => console.log(todo))
    );
  }

  toggleAll(todos: Todo[], checked: boolean): Observable<Todo[]> {
    let updates = todos.map(todo => {
      todo.completed = checked;

      return this.update(todo);
    });

    return combineLatest(updates).pipe(
      tap(todos => console.log(todos))
    );
  }

  clearCompleted() {
    var url = `${this.todoUrl}?completed=true`;

    return this.http.get<Todo[]>(url, this.httpOptions).pipe(
      tap((todos) => todos.forEach(todo => this.delete(todo.id).subscribe()))
    );
  }

}
