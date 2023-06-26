import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { RequestsService } from 'src/app/services/requests.service';
import { Balances, BalancesResponse } from 'src/app/models/general.model';
import { getLogoUrl } from 'src/app/utils/converters';

@Component({
  selector: 'app-balances',
  templateUrl: './balances.component.html',
  styleUrls: ['./balances.component.scss']
})
export class BalancesComponent implements OnInit {

  constructor(
    private reqService: RequestsService,
    private toastr: ToastrService
  ) { }

  isLoading: boolean = true;
  
  balancesArr: MatTableDataSource<Balances> = new MatTableDataSource<Balances>();
  displayedColumns: string[] = ["rowIndex","assetLogo","assetCode", "availableAmount", "availableAmountTRYValue"];
  showLessThanOne : boolean = true;
  hideOrShowText : string = "Göster"

  ngOnInit(): void {
    this.reqService.getBalances().subscribe({
      next: (value: BalancesResponse) => {
        this.toastr.success(value.message, 'Data fetched 😎', { timeOut: 3000 });
        
        const balances = (value.balances ?? []).map((balance: Balances) => {
          balance.assetLogo = getLogoUrl(balance.assetCode);
          return balance;
        });
        this.balancesArr = new MatTableDataSource<Balances>(balances);
        this.onCheckboxChange();
      },
      error: (err) => {
        this.toastr.error('CODE' + err.error.code, err.error.message, { timeOut: 3000 });
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onCheckboxChange(): void {
    if (this.showLessThanOne) {
      const filterValue = "MATIC";
      this.hideOrShowText = "Göster";
      this.balancesArr.filterPredicate = (data: Balances, filter: string) => {
        return data.assetCode !== filterValue;
      };
      this.balancesArr.filter = filterValue;
    } else {
      this.hideOrShowText = "Gizle";
      this.balancesArr.filterPredicate = (data: Balances, filter: string) => {
        return true;
      };
      this.balancesArr.filter = '';
    }
  }

}
