import { Component, Input, OnInit } from '@angular/core';
import { Todo } from "../todo";
import { TodoService } from '../todo.service';
import { ActivatedRoute } from '@angular/router';

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
  snapshot?: Todo;
  currentTodo?: Todo;
  edit: boolean = false;

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

  editTodo(todo: Todo){
    this.snapshot = Object.assign({}, todo)
    this.currentTodo = Object.assign({}, todo)
    this.edit = true;
  }
  
  cancelEdit(){
    this.snapshot = null;
    this.currentTodo = null;
    this.edit = false;
  }

  update(todo: Todo){
    this.todoService.update(todo);
    this.snapshot = null;
    this.currentTodo = null;
    this.edit = false;
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
