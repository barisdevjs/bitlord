import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLoggedIn: Observable<boolean>;
  constructor(
    public authService: AuthService,
    private reqService: RequestsService
    ) {
    this.isLoggedIn = this.reqService.isLoggedIn()
  }
  ngOnInit(): void {
    console.log(this.isLoggedIn);
  }

}
