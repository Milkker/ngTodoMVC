import { Component, OnInit } from '@angular/core';
import { Todo } from "../todo";
import { TODOS } from "../mock_todos";

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit {
  todos: Todo[] = [];

  constructor() { }

  ngOnInit(): void {
    this.todos = TODOS;
  }
}
