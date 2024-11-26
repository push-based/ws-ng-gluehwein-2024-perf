import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';

import { environment } from '../environments/environment';

export const readAccessInterceptor: HttpInterceptorFn = (req, next) => {
  const key = environment.tmdbApiReadAccessKey;

  return next(
    req.clone({
      headers: new HttpHeaders().set('Authorization', `Bearer ${key}`),
      /*setHeaders: {
        Authorization: `Bearer ${key}`,
      },*/
    }),
  );
};
