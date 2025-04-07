import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { NavigationService } from '@services/navigation.service'; // Asegúrate de que la ruta sea correcta
import { inject } from '@angular/core';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const navigationService = inject(NavigationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 422) {
        return throwError(() => error);
      }
      if (error.status === 404) {
        navigationService.navigateToNotFound();
      }
      return throwError(() => error.error?.message || 'Error desconocido');
    }),
  );
};
