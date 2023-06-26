import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SignUser } from '../models/general.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  login(inputs: SignUser): Observable<any> {
    return this.http.post(`${environment.loginURL}`, inputs);
  }

  handleLoginSuccess(token: string): void {
    localStorage.setItem('token', token);
    this.isLoginSubject.next(true);
      this.router.navigateByUrl('/profile'); // Redirect to the profile page after successful login
  }

  logout(): void {
    this.router.navigateByUrl('/logout');
    localStorage.removeItem('token');
  
    setTimeout(() => {
      this.isLoginSubject.next(false);
      this.router.navigateByUrl('/login');
    }, 1500);
  }
  
  
  

  isLoggedIn(): Observable<boolean> {
    return this.isLoginSubject.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}
