import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { RequestsService } from 'src/app/services/requests.service';
import { Balances, BalancesResponse } from 'src/app/types/user-type';

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

  balancesArr: MatTableDataSource<Balances> = new MatTableDataSource<Balances>();
  displayedColumns: string[] = ["rowIndex","assetLogo","assetCode", "availableAmount", "availableAmountTRYValue"];
  showLessThanOne : boolean = true;

  ngOnInit(): void {
    this.reqService.getBalances().subscribe({
      next: (value: BalancesResponse) => {
        this.toastr.success(value.message, 'Data fetched 😎', { timeOut: 3000 });
        const balances = (value.balances ?? []).map((balance: Balances) => {
          balance.assetLogo = this.getLogoUrl(balance.assetCode);
          return balance;
        });
        this.balancesArr = new MatTableDataSource<Balances>(balances);
        console.log(this.balancesArr);
        this.onCheckboxChange();
      },
      error: (err) => {
        this.toastr.error('CODE' + err.error.code, err.error.message, { timeOut: 3000 });
      }
    });
  }
  
  

  onCheckboxChange() {
    if (this.showLessThanOne) {
      const filterValue = "MATIC";
      this.balancesArr.filterPredicate = (data: Balances, filter: string) => {
        return data.assetCode !== filterValue;
      };
      this.balancesArr.filter = filterValue;
    } else {
      this.balancesArr.filterPredicate = (data: Balances, filter: string) => {
        return true;
      };
      this.balancesArr.filter = '';
    }
  }

  getLogoUrl(assetCode: string): string {
    const logoMap = new Map<string, string>([
      ['BTC', 'https://static.bitlo.com/cryptologossvg/btc.svg'],
      ['TRY', 'https://static.bitlo.com/cryptologossvg/usdt.svg'],
      ['ETH', 'https://static.bitlo.com/cryptologossvg/eth.svg'],
    ]);
  
    return logoMap.get(assetCode) || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQShl8h1-nbKHsj_rIRNgRFcyKbHV7vY8oebmiIT1OqvA&s';
  }
  


}
