import { Component, OnInit } from '@angular/core';
import { RequestsService } from './services/requests.service';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    private reqService : RequestsService
  ) { }

  title = 'Bitlord';
  isLoggedIn : boolean = false;

  ngOnInit() {

    this.reqService.isLoggedIn().subscribe({
      next : (data:boolean) => {
         this.isLoggedIn = data
      },
      error : (error:any) => {
        console.log(error);
      }
    })

  }
}


