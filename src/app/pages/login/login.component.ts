import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private cookieService: CookieService,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (response) => {
          if (response.accessToken) {
            this.cookieService.set('token', response.accessToken, 1);
            this.authService.auth(email);
            this.router.navigate(['/']);
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error('Registration failed', err);
          if (err.status === 401) {
            this.errorMessage = 'Invalid Email or Password';
          } else if (err.status === 400) {
            this.errorMessage = 'Invalid input. Please check your data.';
          } else {
            this.errorMessage =
              'An unknown error occurred. Please try again later.';
          }
        },
      });
    }
  }
}
