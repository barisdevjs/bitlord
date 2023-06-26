import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { RequestsService } from 'src/app/services/requests.service';
import { OpenOrders, OpenOrdersResponse } from 'src/app/models/general.model';

@Component({
  selector: 'app-open-orders',
  templateUrl: './open-orders.component.html',
  styleUrls: ['./open-orders.component.scss']
})
export class OpenOrdersComponent implements OnInit {

  constructor(
    private reqService: RequestsService,
    private toastr: ToastrService
  ) { }

  isLoading: boolean = true;
  openOrdersArr : MatTableDataSource<OpenOrders> = new MatTableDataSource<OpenOrders>();
  displayedColumns: string[] = ["marketCode","orderSide","orderDate", "price", "orderAmount", "fillAmount", "fillPercent"];
  
  ngOnInit(): void {
    this.reqService.getOpenOrders().subscribe({
      next : (value: OpenOrdersResponse) => {
        this.toastr.success(value.message, 'Data fetched 😎', { timeOut: 3000 });
        const openOrders = ( value.openOrders ?? []).map((order: OpenOrders) => {
          order.fillPercent = Number(order.fillAmount / order.orderAmount) * 100;
          return order;
        });
        this.openOrdersArr = new MatTableDataSource<OpenOrders>(openOrders);
        console.log(this.openOrdersArr);
      },
      error: (err) => {
        this.toastr.error('CODE' + err.error.code, err.error.message, { timeOut: 3000 });
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }

}
