import { type HttpHandlerFn, type HttpInterceptorFn } from '@angular/common/http';
import { API_WITH_CREDENTIALS_DEFAULT } from './api.constants';

/** Set default `withCredentials` — cookie auth dikirim ke backend. */
export const apiInterceptor: HttpInterceptorFn = (request, next: HttpHandlerFn) => {
  const credentialedRequest = request.clone({
    withCredentials: request.withCredentials ?? API_WITH_CREDENTIALS_DEFAULT,
  });

  return next(credentialedRequest);
};
