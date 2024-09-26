import { DOCUMENT } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = (route, state) => {
  const cookieService = new CookieService(
    inject(DOCUMENT),
    inject(PLATFORM_ID)
  );
  const router = inject(Router);

  const isAuthenticated = cookieService.check('email');

  if (isAuthenticated) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
