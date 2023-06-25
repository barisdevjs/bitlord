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
  
    this.marketsArr.filter = filterValue; // Update the filter value
  
    // Define custom filter predicate for case-sensitive filtering
    this.marketsArr.filterPredicate = (data, filter) => {
      return data.marketCode.includes(filter);
    };
  
    // Trigger the filtering process
    this.marketsArr.filter = filterValue;
  
  
    if (this.marketsArr.paginator) {
      this.marketsArr.paginator.firstPage();
    }
  }

  getStyle(change24h: number): object {
    if (change24h < 0) {
      return { color: 'red' };
    } else if (change24h > 0) {
      return { color: 'green' };
    } else {
      return { color: 'black' };
    }
  }

  /******************** <ul> <li> helper methods  for explanations </li> </ul> ****************/

  countPositiveChanges(): number {
    return this.marketsArr.filteredData.filter((market) => parseFloat(market.change24hPercent) > 0).length;
  }
  
  get maxIncreaseMarket(): any {
    return this.marketsArr.filteredData.reduce((maxMarket, currentMarket) => {
      return currentMarket.change24hPercent > maxMarket.change24hPercent ? currentMarket : maxMarket;
    }, this.marketsArr.filteredData[0]);
  }
  
  get maxDecreaseMarket(): any {
    return this.marketsArr.filteredData.reduce((minMarket, currentMarket) => {
      return currentMarket.change24hPercent < minMarket.change24hPercent ? currentMarket : minMarket;
    }, this.marketsArr.filteredData[0]);
  }
  
  countMarketsAbovePriceThreshold(threshold: number): number {
    return this.marketsArr.filteredData.filter((market) => parseFloat(market.currentQuote) > threshold).length;
  }
  
  countMarketsBelowPriceThreshold(threshold: number): number {
    return this.marketsArr.filteredData.filter((market) => parseFloat(market.currentQuote) < threshold).length;
  }
  
  calculateAveragePrice(): number {
    const total = this.marketsArr.filteredData.reduce((sum, market) => sum + parseFloat(market.currentQuote), 0);
    return total / this.marketsArr.filteredData.length;
  }
  
  
  get usdExchangeRate(): number | null {
    // Calculate the USD exchange rate based on the relevant market's prices
    const btcTryMarket = this.marketsArr.filteredData.find((market) => market.marketCode === 'BTC-TRY');
    const usdtTryMarket = this.marketsArr.filteredData.find((market) => market.marketCode === 'USDT-TRY');
    
    if (btcTryMarket && usdtTryMarket) {
      const btcTryQuote = parseFloat(btcTryMarket.currentQuote);
      const usdtTryQuote = parseFloat(usdtTryMarket.currentQuote);
  
      if (!isNaN(btcTryQuote) && !isNaN(usdtTryQuote) && usdtTryQuote !== 0) {
        return btcTryQuote / usdtTryQuote;
      }
    }
  
    return null;
  }
  
  

}
