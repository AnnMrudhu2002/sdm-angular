import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const isLoggedIn = !!sessionStorage.getItem('token');

  if (isLoggedIn) {
    // If already logged in, redirect to dashboard 
    router.navigate(['/admin/dashboard']);
    return false;
  }

  return true; // allow access to login/register
};
