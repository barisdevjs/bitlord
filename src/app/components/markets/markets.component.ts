import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { RequestsService } from 'src/app/services/requests.service';
import { MarketsResponse } from 'src/app/models/general.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatSort, Sort } from '@angular/material/sort';
import {LiveAnnouncer} from '@angular/cdk/a11y';

@Component({
  selector: 'app-markets',
  templateUrl: './markets.component.html',
  styleUrls: ['./markets.component.scss']
})
export class MarketsComponent implements OnInit, AfterViewInit {

  constructor(
    private reqService: RequestsService,
    private router: Router,
    private toastr: ToastrService,
    private _liveAnnouncer: LiveAnnouncer
  ) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isLoading = true;

  pageSizeOptions: number[] = [5, 10, 15, 20];
  pageIndex = 0;
  pageSize = 5;
  totalItems = 0;
  marketsArr: MatTableDataSource<MarketsResponse> = new MatTableDataSource<MarketsResponse>();
  displayedColumns: string[] = ['rowIndex', 'marketCode', 'currentQuote', 'change24h', 'change24hPercent', 'highestQuote24h', 'lowestQuote24h'];

  tooltipClass = 'bg-blue-600 text-sm';
  capsLock = false;

  ngOnInit(): void {
    this.reqService.getMarkets().subscribe({
      next: (value: MarketsResponse[]) => {
        this.marketsArr.data = value;
        this.totalItems = value.length;
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || "Something went wrong", 'WARNING', { timeOut: 5000 });
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit() {
    this.marketsArr.paginator = this.paginator;
    this.marketsArr.sort = this.sort; // Add this line to connect the MatSort instance
  }
  

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginator.pageIndex = this.pageIndex;
    this.paginator.pageSize = this.pageSize;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();

    if (filterValue === "") {
      this.marketsArr.filter = '';
    } else {
      this.marketsArr.filter = filterValue;

      this.marketsArr.filterPredicate = (data, filter) => {
        return data.marketCode.includes(filter);
      };
    }

    if (this.marketsArr.paginator) {
      this.marketsArr.paginator.firstPage();
    }
  }

  navigateToMarketDetails(row: MarketsResponse) {
    const marketCode = row.marketCode;
    this.router.navigateByUrl(`/markets/${marketCode}`);
  }

  handleCapsLock(capsLockValue: boolean): void {
    this.capsLock = capsLockValue;
  }


  getStyle(change24hPercent: number): object {
    if (change24hPercent < 0) {
      return { color: 'red' };
    } else if (change24hPercent > 0) {
      return { color: 'green' };
    } else {
      return { color: 'black' };
    }
  }

  /******************** <ul> <li> helper methods  for explanations </li> </ul> ****************/

  countPositiveChanges(): number {
    return this.marketsArr.filteredData.filter((market) => parseFloat(market.change24hPercent) > 0).length;
  }

  get maxIncreaseMarket(): MarketsResponse {
    return this.marketsArr.filteredData.reduce((maxMarket, currentMarket) => {
      return currentMarket.change24hPercent > maxMarket.change24hPercent ? currentMarket : maxMarket;
    }, this.marketsArr.filteredData[0]);
  }

  get maxDecreaseMarket(): MarketsResponse {
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

  // For Just Screen Readers

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }



}
