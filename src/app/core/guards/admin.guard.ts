import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthMockService } from '../api/mock/auth.mock.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthMockService);
  const router = inject(Router);

  if (authService.role() === 'admin') {
    return true;
  }
  
  return router.createUrlTree(['/auth/login']);
};
