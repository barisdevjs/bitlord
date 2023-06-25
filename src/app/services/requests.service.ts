import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { BalancesResponse, LoginResponse, MarketsResponse, OpenOrdersResponse, ProfileResponse, SignUser } from '../types/user-type';

const token = localStorage.getItem('token');

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

  private loginURL = 'https://akademi-cp.bitlo.com/api/interview/auth/login';
  private meURL = "https://akademi-cp.bitlo.com/api/interview/auth/me";
  private marketsURL = "https://akademi-cp.bitlo.com/api/interview/markets";
  private balancesURL = "https://akademi-cp.bitlo.com/api/interview/auth/balances";
  private openOrdersUrl = "https://akademi-cp.bitlo.com/api/interview/auth/open-orders";

  signUser(inputs: SignUser): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginURL, inputs, httpOptions)
  }

  isLoggedIn(): Observable<boolean> {
    const flag: boolean = !!localStorage.getItem('token');
    return of(flag);
  }

  getProfile(): Observable<ProfileResponse> {
    return this.http.post<ProfileResponse>(this.meURL, httpOptions);
  }

  getMarkets(): Observable<MarketsResponse[]> {
    return this.http.get<any>(this.marketsURL, httpOptions)
      .pipe(
        map((response: any[]) => {
          // Extract the desired properties from each object in the array
          return response.map((obj) => {
            const { weightedAverage24h, volume24h, notionalVolume24h, ask, bid, ...rest } = obj;
            return rest as MarketsResponse;
          });
        })
      );
  }

  getBalances(): Observable<BalancesResponse> {
    return this.http.post<BalancesResponse>(this.balancesURL, httpOptions)
  }
  
  getOpenOrders(): Observable<OpenOrdersResponse> {
    return this.http.post<OpenOrdersResponse>(this.openOrdersUrl, httpOptions)
  }

  

}
