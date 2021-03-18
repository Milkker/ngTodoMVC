import { Component, OnInit } from '@angular/core';
import { Todo } from "../todo";

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  todo: Todo

  constructor() { }

  ngOnInit(): void {
  }

}
