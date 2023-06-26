import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { RequestsService } from 'src/app/services/requests.service';
import { MarketsResponse } from 'src/app/models/general.model';
import { getLogoUrl } from 'src/app/utils/converters';

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

  assetLogo : string = ""

  constructor(
    private route: ActivatedRoute,
    private reqService: RequestsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getmarketCode();
    this.getSingleMarket().subscribe({
      next: (value: MarketsResponse | undefined) => {
        this.data = value!;
        console.log(this.data)
      },
      error: (err) => {
        console.log(err);
      },
      complete : () => {
        this.assetLogo = getLogoUrl(this.data.marketCode.substring(0,3))
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


  getStyle(weightedAverage24h: string | undefined): object {
    if (typeof weightedAverage24h !== 'undefined') {
      if (Number(weightedAverage24h) < 0) {
        return { color: 'red', fontSize : "1.25rem" };
      } else if (Number(weightedAverage24h) > 0) {
        return { color: 'green', fontSize : "1.25rem" };
      }
    }
    return { color: 'black' };
  }
  



}
