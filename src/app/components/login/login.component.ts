import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { RequestsService } from 'src/app/services/requests.service';
import { LoginResponse, SignUser } from 'src/app/types/user-type';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { delay, tap } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  hide: boolean = true;
  logForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private reqService: RequestsService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.logForm = this.fb.group({
      identifier: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(6)]],
    });

    this.logForm.patchValue({
      identifier: 'test@test.com',
      password: '123abc'
    } as SignUser);
  }

  logUser() {
    if (this.logForm.valid) {
      this.reqService.signUser(this.logForm.value).pipe(
        tap((data: LoginResponse) => {
          data?.token && localStorage.setItem('token', data?.token);
          this.toastr.success(data?.message, 'Success', { timeOut: 3000 });
        }),
        delay(1500)
      ).subscribe({
        next: () => {
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          console.log(err);
          this.toastr.error(err?.message, 'WARNING', { timeOut: 5000 });
        }
      });
    }
  }



}