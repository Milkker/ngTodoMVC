import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { range } from 'rxjs';
import { Pagination } from '../pagination.model';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() pagination: Pagination = {
    count: 1000,
    currentPage: 1,
    pageSize: 5
  }
  @Output() pageChange = new EventEmitter<number>();
  maxPage: number;
  pages: number[];

  constructor() { }

  ngOnInit(): void {
  }

  ngDoCheck(): void {
    this.maxPage = Math.ceil(this.pagination.count / this.pagination.pageSize);

    this.setPageList();
  }

  setPageList() {
    this.pages = [];
    let beginPage = this.pagination.currentPage - 2;
    let endPage = this.pagination.currentPage + 2;

    if (beginPage < 1)
      beginPage = 1;

    if (endPage > this.maxPage)
      endPage = this.maxPage;

    range(beginPage, endPage - beginPage + 1).subscribe(page => this.pages.push(page));
  }

  prev() {
    if (this.pagination.currentPage <= 1)
      return;

    this.goToPage(this.pagination.currentPage - 1);
  }

  next() {
    if (this.pagination.currentPage >= this.maxPage)
      return;

    this.goToPage(this.pagination.currentPage + 1);
  }

  goToPage(page: number) {
    if (page > this.maxPage)
      page = this.maxPage;

    if (page < 1)
      page = 1;

    if (this.pagination.currentPage == page)
      return;

    this.pagination.currentPage = page;
    this.pageChange.emit(page);
  }

}
