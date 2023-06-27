import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoginResponse, SignUser } from '../models/general.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(
    private router: Router,
    private http: HttpClient,
    public toastr: ToastrService
  ) {}

  login(inputs: SignUser): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.loginURL}`, inputs);
  }

  handleLoginSuccess(token: string, message:string): void {
    sessionStorage.setItem('token', token);
    this.isLoginSubject.next(true);
    this.toastr.success(message, 'Success', { timeOut: 3000 });
    this.router.navigateByUrl('/profile'); 
  }

  logout(): void {
    this.router.navigateByUrl('/logout');
    sessionStorage.removeItem('token');
  
    setTimeout(() => {
      this.isLoginSubject.next(false);
      this.router.navigateByUrl('/login');
    }, 2500);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoginSubject.asObservable();
  }

  private hasToken(): boolean {
    return !!sessionStorage.getItem('token');
  }
}
