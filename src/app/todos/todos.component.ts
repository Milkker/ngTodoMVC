import { Component, Input, OnInit } from '@angular/core';
import { Todo } from "../todo";
import { TodoService } from '../todo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Pagination, UtilsPagination  } from "../pagination.model";

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit {
  pagination: Pagination = {
    count: 0,
    currentPage: 1,
    pageSize: 5,
  }
  pagingTodos: Todo[];

  @Input() newTodo: string = "";
  todos: Todo[] = [];
  remaining: Number;
  compltedCount: Number;
  filter: string;
  filteredTodos: Todo[];
  snapshot?: Todo;
  currentTodo?: Todo;
  edit: boolean = false;

  constructor(private todoService: TodoService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.todos = this.todoService.getTodos();
    this.route.params.subscribe(params => {
      this.filter = params["filter"] || "all";

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

      this.pagination.currentPage = +(params["page"] || 1);
    });
  }

  ngDoCheck(): void {
    this.remaining = this.todos.filter(todo => !todo.completed).length || 0;
    this.compltedCount = this.todos.filter(todo => !!todo.completed).length || 0;
    this.pagination.count = this.filteredTodos.length || 0;
    this.pagingTodos = UtilsPagination.GetPageData(this.filteredTodos, this.pagination);
  }

  toggleAll(checked: boolean) {
    this.todoService.toggleAll(checked);
  }

  toggle(todo: Todo) {
    todo.completed = !todo.completed;
  }

  editTodo(todo: Todo) {
    this.snapshot = Object.assign({}, todo)
    this.currentTodo = Object.assign({}, todo)
    this.edit = true;
  }

  cancelEdit() {
    this.snapshot = null;
    this.currentTodo = null;
    this.edit = false;
  }

  update(todo: Todo) {
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

  goToPage(page: number) {
    this.router.navigate(['/', this.filter, page], { relativeTo: this.route });
  }
}
