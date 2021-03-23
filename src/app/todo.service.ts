import { Injectable } from '@angular/core';
import { TODOS } from './mock_todos';
import { Todo } from './todo';
import { combineLatest, Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";



@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todoUrl = "http://localhost:3000/todos";
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private todos: Todo[] = TODOS;

  constructor(private http: HttpClient) { }

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.todoUrl);
  }

  add(newTodo: string): Observable<Todo> {
    return this.http.post<Todo>(
      this.todoUrl,
      { name: newTodo, completed: false },
      this.httpOptions
    ).pipe(
      tap(todo => console.log(todo)),
      catchError(this.handleError<Todo>('add Hero'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  update(todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.todoUrl}/${todo.id}`, todo, this.httpOptions).pipe(
      tap((todo) => console.log(todo)),
      catchError(this.handleError<Todo>("update todo"))
    );
  }

  delete(id: number): Observable<Todo> {
    return this.http.delete<Todo>(`${this.todoUrl}/${id}`, this.httpOptions).pipe(
      tap((todo) => console.log(todo)),
      catchError(this.handleError<Todo>("delete todo"))
    );
  }

  toggleAll(todos: Todo[], checked: boolean) : Observable<Todo[]> {
    let updates = todos.map(todo => {
      todo.completed = checked;

      return this.update(todo);
    });

    return combineLatest(updates).pipe(
      tap(todos => console.log(todos)),
      catchError(this.handleError<Todo[]>("toggleAll todo"))
    );
  }

  clearCompleted() {
    let compltedIds = this.todos.filter(todo => !!todo.completed).map(todo => todo.id);

    compltedIds.forEach(id => this.delete(id));

    console.log(compltedIds);
  }

}
