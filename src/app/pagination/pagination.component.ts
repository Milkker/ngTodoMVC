import { Component, Input, OnInit } from '@angular/core';
import { range } from 'rxjs';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() count: number = 1000;
  @Input() currentPage: number = 1;
  @Input() pageSize: number = 5;
  maxPage: number;
  pages: number[];

  constructor() { }

  ngOnInit(): void {
  }

  ngDoCheck(): void {
    this.maxPage = Math.ceil(this.count / this.pageSize);

    if (this.currentPage > this.maxPage) {
      this.currentPage = this.maxPage;
    }

    this.pages = [];
    let beginPage = this.currentPage - 2;
    let endPage = this.currentPage + 2;

    if (beginPage < 1)
      beginPage = 1;

    if (endPage > this.maxPage)
      endPage = this.maxPage;

    range(beginPage, endPage - beginPage + 1).subscribe(page => this.pages.push(page));
  }

  prev() {
    if (this.currentPage > 1)
      this.currentPage -= 1;
  }

  next() {
    if (this.currentPage < this.maxPage)
      this.currentPage++;
  }

}
