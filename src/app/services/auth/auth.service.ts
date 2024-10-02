import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  isAuthenticated$: Observable<boolean>;
  userEmail!: string;
  private apiUrl: string;

  constructor(private cookieService: CookieService, private http: HttpClient) {
    this.userEmail = this.cookieService.get('email') || '';
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
    this.apiUrl = `${window.location.protocol}//${window.location.hostname}:5125/api`;
  }

  private hasToken(): boolean {
    return !!this.cookieService.get('email');
  }

  login(email: string, password: string): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/Users/login`, { email, password })
      .pipe(
        catchError(error => {
          console.error('Login error:', error);
          throw error;
        })
      );
  }

  auth(email: string) {
    this.userEmail = email;
    this.cookieService.set('email', email);
    this.isAuthenticatedSubject.next(true);
  }

  logout() {
    this.cookieService.delete('email');
    this.cookieService.delete('token');
    this.isAuthenticatedSubject.next(false);
    this.userEmail = '';
  }

  register(email: string, password: string) {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/Users/register`, { email, password })
      .pipe(
        catchError(error => {
          console.error('Registration error:', error);
          throw error;
        })
      );
  }


  validateToken(token: string): Observable<boolean> {
    return this.http.post<{ valid: boolean }>(`${this.apiUrl}/Users/validateToken`, null, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      map(response => response.valid),
    );
  }
}
