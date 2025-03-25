import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, catchError } from 'rxjs/operators';
import { LoadingService } from '../../services/loading.service';
import { throwError } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  loadingService.showLoading();

  return next(req).pipe(
    catchError((error) => {
      console.error('Error en la solicitud HTTP:', error);
      return throwError(() => error); // Propaga el error
    }),
    finalize(() => loadingService.hideLoading()), // Oculta el loading cuando finaliza
  );
};
