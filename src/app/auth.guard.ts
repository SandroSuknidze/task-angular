import { DOCUMENT } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { catchError, map, Observable } from 'rxjs';
import { AuthService } from './services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const cookieService = new CookieService(
    inject(DOCUMENT),
    inject(PLATFORM_ID)
  );
  const router = inject(Router);
  const authService = inject(AuthService);

  const token = cookieService.get('token');

  if (token) {
    return authService.validateToken(token).pipe(
      map((isValid) => {
        if (isValid) {
          router.navigate(['/']);
          return false;
        } else {
          return true;
        }
      }),
      catchError((err) => {
        console.error('Token validation error:', err);
        authService.logout();
        router.navigate(['/']);

        return new Observable<boolean>((observer) => {
          observer.next(false);
          observer.complete();
        });
      })
    );
  }
  return true;
};
