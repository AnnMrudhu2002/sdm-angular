import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './services/auth-service';
import { inject } from '@angular/core';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req).pipe(
    catchError((err) => {
      if (err.status === 401) {
        authService.logout(); // redirect to login
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};
