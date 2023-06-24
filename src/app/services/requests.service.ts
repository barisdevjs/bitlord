import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LoginResponse, ProfileResponse, SignUser } from '../types/user-type';

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

}
