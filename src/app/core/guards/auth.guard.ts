import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  let authService = inject(AuthService);
  let router = inject(Router);

  // Verificamos autenticación con el servidor si no está en memoria
  return authService.checkAuthentication().pipe(
    map((isAuth) => {
      if (isAuth) {
        // Si el usuario está autenticado y está intentando ir a '/login'
        if (state.url === '/login') {
          router.navigate(['/admin/dashboard']);
          return false;
        }
        authService.fetchUser().subscribe();

        return true;
      } else {
        if (state.url === '/login') {
          return true;
        }
        // Redirige al login si no está autenticado y quiere ir a otra ruta
        router.navigate(['/login']);
        return false;
      }
    }),
  );
};
