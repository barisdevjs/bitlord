import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { RequestsService } from 'src/app/services/requests.service';
import { MarketsResponse } from 'src/app/models/general.model';
import { getLogoUrl } from 'src/app/utils/converters';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-market-details',
  templateUrl: './market-details.component.html',
  styleUrls: ['./market-details.component.scss']
})
export class MarketDetailsComponent implements OnInit {

  marketCode: string = "";
  data: MarketsResponse = {
    marketCode: "",
    currentQuote: "",
    change24h: "",
    change24hPercent: "",
    highestQuote24h: "",
    lowestQuote24h: ""
  };

  isLoading = true;

  assetLogo : string = ""

  constructor(
    private route: ActivatedRoute,
    private reqService: RequestsService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getmarketCode();
    this.getSingleMarket().subscribe({
      next: (value: MarketsResponse | undefined) => {
        this.data = value!;
      },
      error: (err) => {
        this.toastr.error('CODE' + err.error.code, err.error.message, { timeOut: 3000 });
        this.isLoading = false;
      },
      complete : () => {
        this.assetLogo = getLogoUrl(this.data.marketCode.split("-")[0]);
        this.isLoading = false;
      }
    });
  }

  getmarketCode(): string {
    this.route.paramMap.subscribe(params => {
      this.marketCode = params.get('marketCode') ?? '';
    });
    return this.marketCode;
  }

  getSingleMarket(): Observable<MarketsResponse | undefined> {
    return this.reqService.getMarkets().pipe(
      map((value: MarketsResponse[]) => {
        return value.find((e) => e.marketCode === this.marketCode);
      }),
      catchError((error) => {
        console.log(error);
        return of(undefined);
      })
    );
  }

  getStyle(change24hPercent: string | undefined): object {
    if (typeof change24hPercent !== 'undefined') {
      if (Number(change24hPercent) < 0) {
        return { color: 'red', fontSize : "1.25rem" };
      } else if (Number(change24hPercent) > 0) {
        return { color: 'green', fontSize : "1.25rem" };
      }
    }
    return { color: 'white' };
  }

}
