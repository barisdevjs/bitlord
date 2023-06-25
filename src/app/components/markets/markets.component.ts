import { Component, OnInit, ViewChild } from '@angular/core';
import { RequestsService } from 'src/app/services/requests.service';
import { MarketsResponse } from 'src/app/types/user-type';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-markets',
  templateUrl: './markets.component.html',
  styleUrls: ['./markets.component.scss']
})
export class MarketsComponent implements OnInit {

  constructor(
    private reqService: RequestsService
  ) { }

  pageSizeOptions: number[] = [5, 10, 15,20];
  pageIndex = 0;
  pageSize = 5;
  totalItems = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  

  marketsArr: MatTableDataSource<MarketsResponse> = new MatTableDataSource<MarketsResponse>();
  displayedColumns: string[] = ['rowIndex', 'marketCode', 'currentQuote', 'change24h', 'change24hPercent', 'highestQuote24h', 'lowestQuote24h'];

  ngAfterViewInit() {
    this.marketsArr.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.reqService.getMarkets().subscribe({
      next: (value: MarketsResponse[]) => {
        this.marketsArr.data = value;
        this.totalItems = value.length;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginator.pageIndex = this.pageIndex;
    this.paginator.pageSize = this.pageSize;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    console.log(filterValue);
    this.marketsArr.filter =  filterValue.trim().toLowerCase();
  
    if (this.marketsArr.paginator) {
      this.marketsArr.paginator.firstPage();
    }
  }
  

}
