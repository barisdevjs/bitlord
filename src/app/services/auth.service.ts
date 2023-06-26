import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(
    private router: Router,
  ) {}


  login(): void {
    !this.isLoginSubject.value && this.router.navigateByUrl('/login');
  }

  logout(): void {
    this.router.navigateByUrl('/logout');
    this.isLoginSubject.next(false);
    // Delay execution using delay operator
    this.isLoginSubject.pipe(delay(2000)).subscribe(() => {
      localStorage.removeItem('token');
      this.router.navigateByUrl('/login');
    });
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoginSubject.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}
