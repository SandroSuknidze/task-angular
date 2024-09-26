import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  isAuthenticated$: Observable<boolean>;
  userEmail!: string;

  constructor(private cookieService: CookieService) {
    this.userEmail = this.cookieService.get('email') || '';
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  }

  private hasToken(): boolean {
    return !!this.cookieService.get('email');
  }

  login(email: string) {
    this.userEmail = email;
    this.cookieService.set('email', email);
    this.isAuthenticatedSubject.next(true);
  }

  logout() {
    this.cookieService.delete('email');
    this.isAuthenticatedSubject.next(false);
    this.userEmail = '';
  }
}
