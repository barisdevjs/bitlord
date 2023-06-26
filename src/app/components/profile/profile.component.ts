import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { RequestsService } from 'src/app/services/requests.service';
import { ProfileResponse } from 'src/app/models/general.model';
import { dateFormatter, formatPhoneNumberValue } from 'src/app/utils/converters';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile: ProfileResponse = {
    code: 0,
    message: '',
    me: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      phoneNumber: '',
      identityNumber: ''
    }
  };

  isLoggedIn: boolean = false;
  isLoading: boolean = true;


  displayedColumns: string[] = ['key', 'value'];
  dataSource: MatTableDataSource<{ key: string, value: string }> = new MatTableDataSource<{ key: string, value: string }>([]);

  constructor(
    private reqService: RequestsService,
    private toastr: ToastrService,
    private auth : AuthService
  ) { }

  ngOnInit(): void {
    this.auth.isLoggedIn().subscribe({
      next: (isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      }
    });

    this.reqService.getProfile().subscribe({
      next: (response: ProfileResponse) => {
        this.profile = response;
        !this.isLoggedIn && this.toastr.success(response?.message, 'You are good to go', { timeOut: 3000 });
        const data = Object.entries(response.me ?? {}).map(([key, value]) => ({ key, value }));
        this.dataSource.data = this.formatData(data);
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || "Something went wrong",'WARNING', { timeOut: 5000 });
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private formatData(data: { key: string, value: string }[]): { key: string, value: string }[] {
    return data.map(item => {
      if (item.key === 'phoneNumber') {
        item.value = formatPhoneNumberValue(item.value);
      }

      if (item.key === 'dateOfBirth') {
        item.value = dateFormatter(item.value);
      }
      return item;
    });
  }


}
