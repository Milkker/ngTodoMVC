import { Injectable } from '@angular/core';
import { TODOS } from './mock_todos';
import { Todo } from './todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor() { }

  getTodos(): Todo[] {
    return TODOS;
  }
}
