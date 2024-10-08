import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from './jwt-payload';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  isAuthenticated$: Observable<boolean>;
  userEmail!: string;
  userRole!: string | null;
  private apiUrl: string;
  router = inject(Router);

  constructor(private cookieService: CookieService, private http: HttpClient) {
    this.userEmail = this.cookieService.get('email') || '';
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
    this.apiUrl = `${window.location.protocol}//${window.location.hostname}:5125/api`;
    this.userRole = this.getUserRole();
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
    this.userRole = this.getUserRole();
  }

  logout() {
    this.cookieService.delete('email');
    this.cookieService.delete('token');
    this.isAuthenticatedSubject.next(false);
    this.userEmail = '';
    this.router.navigate(['/']);
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

  getUserRole(): string | null {
    const token = this.cookieService.get('token');
    if(token) {
      const decoded: JwtPayload = jwtDecode(token);
      return decoded.Role;
    }
    return null;
  }
}
