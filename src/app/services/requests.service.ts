import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { BalancesResponse, LoginResponse, MarketsResponse, OpenOrdersResponse, ProfileResponse, SignUser } from '../models/general.model';
import { environment } from 'src/environments/environment';

const token = sessionStorage.getItem('token');

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'x-bitlo-auth': token || '' // Add the token or an empty string if it's not available
  })
};

@Injectable({
  providedIn: 'root'
})

export class RequestsService {

  constructor(private http: HttpClient) { }

  getProfile(): Observable<ProfileResponse> {
    return this.http.post<ProfileResponse>(`${environment.meURL}`, httpOptions);
  }

  getMarkets(): Observable<MarketsResponse[]> {
    return this.http.get<any>(`${environment.marketsURL}`, httpOptions)
      .pipe(
        map((response: any[]) => {
          // Extract unwanted properties from each object in the array
          return response.map((obj) => {
            const { volume24h, notionalVolume24h, ask, bid, ...rest } = obj;
            return rest as MarketsResponse;
          });
        })
      );
  }

  getBalances(): Observable<BalancesResponse> {
    return this.http.post<BalancesResponse>(`${environment.balancesURL}`, httpOptions)
  }
  
  getOpenOrders(): Observable<OpenOrdersResponse> {
    return this.http.post<OpenOrdersResponse>(`${environment.openOrdersUrl}`, httpOptions)
  }
  

}
