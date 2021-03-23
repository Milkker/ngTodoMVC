import { Component, Input, OnInit } from '@angular/core';
import { Todo } from "../todo";
import { TodoService } from '../todo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Pagination, UtilsPagination } from "../pagination.model";
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { stringify } from '@angular/compiler/src/util';

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

  @Input() newTodo: string = "";
  todos$: Observable<Todo[]>
  private todoTerms = new Subject<{
    filter: string,
    page: number,
    pageSize: number
  }>();
  todos: Todo[] = [];
  allCompleted: boolean = false;
  filter: string;
  summary: {
    totalCount: number,
    filteredCount: number,
    remaining: number,
    compltedCount: number
  } = {
      totalCount: 0,
      filteredCount: 0,
      remaining: 0,
      compltedCount: 0
    }

  snapshot?: Todo;
  currentTodo?: Todo;
  edit: boolean = false;

  constructor(private todoService: TodoService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.todos$ = this.todoTerms.pipe(
      //避免相同的條件重複呼叫
      distinctUntilChanged((x, y) => x.filter === y.filter && x.page === y.page && x.pageSize === y.pageSize),
      tap(term => {
        this.todoService.getSummary(term.filter).subscribe(summary => {
          this.summary = summary;
          this.pagination.count = summary.filteredCount;
        });
      }),
      switchMap((term) => {
        return this.todoService.getTodos(term.filter, term.page, term.pageSize);
      })
    )
    this.route.params.subscribe(params => {
      this.filter = params["filter"] || "all";
      this.pagination.currentPage = +(params["page"] || 1);
    });
  }

  refreash() {
    this.todoService.getSummary(this.filter).subscribe(summary => {
      this.summary = summary;
      this.pagination.count = summary.filteredCount;
    });
    this.todos$ = this.todoService.getTodos(this.filter, this.pagination.currentPage, this.pagination.pageSize);
  }

  ngDoCheck(): void {
    let term = {
      filter: this.filter,
      page: this.pagination.currentPage,
      pageSize: this.pagination.pageSize
    }

    this.todoTerms.next(term);
  }

  toggleAll(toggles: Todo[], checked: boolean) {
    this.todoService.toggleAll(toggles, checked).subscribe(todos => {
      this.refreash();
    })
  }

  toggle(todo: Todo) {
    todo.completed = !todo.completed;

    this.todoService.update(todo).subscribe(newTodo => {
      this.refreash();
    });
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
    this.todoService.update(todo).subscribe((newTodo) => {
      this.snapshot = null;
      this.currentTodo = null;
      this.edit = false;

      this.refreash();
    })
  }

  remove(todo: Todo) {
    let id = todo.id;

    this.todoService.delete(id).subscribe(todo => {
      this.refreash();
    })
  }

  add(newTodo: string) {
    newTodo = newTodo || "";

    if (!newTodo)
      return;

    this.todoService.add(newTodo).subscribe(newTodo => {
      this.refreash()
      this.newTodo = "";
    })
  }

  clearCompleted() {
    this.todoService.clearCompleted().subscribe(todos => {
      this.refreash();
    })
  }

  goToPage(page: number) {
    this.router.navigate(['/', this.filter, page], { relativeTo: this.route });
  }
}
