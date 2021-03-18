import { Component, OnInit, Input } from '@angular/core';
import { Todo } from "../todo";
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  @Input() todo: Todo

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
  }

  toggle(todo: Todo) {
    todo.completed = !todo.completed;
  }

  remove(todo: Todo) {
    this.todoService.delete(todo.id);
  }

}
