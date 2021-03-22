import { Component, Input, OnInit } from '@angular/core';
import { Todo } from "../todo";
import { TodoService } from '../todo.service';
import { ActivatedRoute } from '@angular/router';
import { ɵangular_packages_platform_browser_platform_browser_j } from '@angular/platform-browser';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit {
  @Input() newTodo: string = "";
  todos: Todo[] = [];
  remaining: Number;
  compltedCount: Number;
  filter: string;
  filteredTodos: Todo[];

  constructor(private todoService: TodoService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.todos = this.todoService.getTodos();
    this.route.params.subscribe(params => {
      this.filter = params["filter"];

      switch (this.filter) {
        case "active":
          this.filteredTodos = this.todos.filter(todo => !todo.completed);
          break;
        case "completed":
          this.filteredTodos = this.todos.filter(todo => !!todo.completed);
          break;
        default:
          this.filteredTodos = this.todos;
          break;
      }
    });
  }

  ngDoCheck(): void {
    this.remaining = this.todos.filter(todo => !todo.completed).length || 0;
    this.compltedCount = this.todos.filter(todo => !!todo.completed).length || 0;
  }

  toggleAll(checked: boolean) {
    this.todoService.toggleAll(checked);
  }

  toggle(todo: Todo) {
    todo.completed = !todo.completed;
  }

  remove(todo: Todo) {
    this.todoService.delete(todo.id);
  }

  add(newTodo: string) {
    newTodo = newTodo || "";

    if (!newTodo)
      return;

    this.todoService.add(newTodo);
    this.newTodo = "";
  }

  clearCompleted() {
    this.todoService.clearCompleted();
  }
}
