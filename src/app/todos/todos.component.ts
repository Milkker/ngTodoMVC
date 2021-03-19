import { Component, Input, OnInit } from '@angular/core';
import { Todo } from "../todo";
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit {
  @Input() newTodo: string = "";
  todos: Todo[] = [];
  remaining: any;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.todos = this.todoService.getTodos();
  }

  ngDoCheck(): void {
    this.remaining = this.todos.filter(todo => !todo.completed).length || 0;
  }

  add(newTodo: string) {
    newTodo = newTodo || "";

    if (!newTodo)
      return;

    this.todoService.add(newTodo);
    this.newTodo = "";
  }

  toggle(todo: Todo) {
    this.todoService.toggle(todo);
  }
}
