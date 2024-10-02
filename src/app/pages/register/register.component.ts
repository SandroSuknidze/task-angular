import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private cookieService: CookieService,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      this.authService.register(email, password).subscribe({
        next: () => {
          this.cookieService.set('email', email, 1);
          this.authService.auth(email);
          this.router.navigate(['/']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Registration failed', err);
          if (err.status === 409) {
            this.errorMessage = 'Email already exists.';
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
