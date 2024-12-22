// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const clonedRequest = req.clone({
    withCredentials: true, // Asegura que las cookies se envíen con cada solicitud
  });

  return next(clonedRequest);
};