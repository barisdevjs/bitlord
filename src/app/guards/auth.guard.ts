import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private toastr: ToastrService,
    private router: Router,
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const flag = localStorage.getItem('token')

    if (!flag) {
      this.toastr.warning('Route is protected by guard  🔑', 'You will be redirected to home', { timeOut: 3000 })
        .onHidden.pipe()
        .subscribe(() => {
          this.router.navigate(['/']);
        });
    }
    return !!flag;
  }
  
}
