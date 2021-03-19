import { Injectable } from '@angular/core';
import { TODOS } from './mock_todos';
import { Todo } from './todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todos: Todo[] = TODOS;

  constructor() { }

  getTodos(): Todo[] {
    return this.todos;
  }

  add(newTodo: string) {
    let todo:Todo = { id: -1, name: newTodo, completed: false };

    //取得下一個id
    todo.id = this.todos.reduce((maxId, curr) => curr.id > maxId ? curr.id : maxId, -1) + 1;

    this.todos.push(todo);
  }

  toggle(todo: Todo) {
    todo.completed = !todo.completed;
  }

  completed(todo: Todo) {
    todo.completed = true;
  }

  delete(id: number) {
    this.todos.splice(this.todos.findIndex(m => m.id === id), 1);
  }
    
}
