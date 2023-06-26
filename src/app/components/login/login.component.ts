import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {  SignUser } from 'src/app/models/general.model';
import { ToastrService } from 'ngx-toastr';
import {  first } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  hide: boolean = true;
  logForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService
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
    this.isLoading = true;
    this.authService.login(this.logForm.value)
    .pipe(first())
    .subscribe({
      next: (value) => {
        this.authService.handleLoginSuccess(value.token, value.message);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error("Kullanıcı adı ya da parola yanlış", 'Error', { timeOut: 3000 });
      },
      complete:() => {
        this.isLoading = false;
      },
    });
  }



}
