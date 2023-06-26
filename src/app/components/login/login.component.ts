import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { RequestsService } from 'src/app/services/requests.service';
import {  SignUser } from 'src/app/models/general.model';
import { Router } from '@angular/router';
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

  constructor(
    private fb: FormBuilder,
    private reqService: RequestsService,
    private router: Router,
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
    });
  }



}
