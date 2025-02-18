import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 422) {
        return throwError(() => error);
      }
      return throwError(() => error.error.message);
    })
  );
};
