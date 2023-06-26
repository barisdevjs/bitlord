import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authService.isLoggedIn().pipe(
      map(isLoggedIn => {
        if (!isLoggedIn) {
          this.toastr.warning('Route is protected by guard  🔑 \n Sadece giriş yapmış kullanıcılar bu alanı görüntüleyebilir', 'You will be redirected to home', { timeOut: 3000 })
            .onHidden.pipe()
            .subscribe(() => {
              this.router.navigate(['/']);
            });
          return false;
        }
        return true;
      })
    );
  }
}
