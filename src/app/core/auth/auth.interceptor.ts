import { HttpErrorResponse, type HttpHandlerFn, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { SKIP_AUTH, SKIP_REFRESH } from '../services/api/api.context';
import { AuthService } from './auth.service';

/** Handle 401 → refresh cookie session → retry request. */
export const authInterceptor: HttpInterceptorFn = (request, next: HttpHandlerFn) => {
  const auth = inject(AuthService);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401) {
        return throwError(() => error);
      }

      if (request.context.get(SKIP_REFRESH) || request.context.get(SKIP_AUTH)) {
        return throwError(() => error);
      }

      return auth.refreshSession().pipe(
        switchMap(() => next(request)),
        catchError((refreshError) => {
          auth.clearSession();
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
