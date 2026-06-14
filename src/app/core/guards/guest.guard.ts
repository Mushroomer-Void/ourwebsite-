import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthMockService } from '../api/mock/auth.mock.service';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthMockService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true;
  }
  
  return router.createUrlTree(['/']);
};
