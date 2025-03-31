import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

import { AuthService } from '@services/auth.service';
import { User } from '@interfaces/User';
import { HeaderComponent } from '../header/header.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-index',
  imports: [RouterOutlet, HeaderComponent, NavbarComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexAdminComponent {
  // Inyección de dependencias
  private readonly authService = inject(AuthService);

  /**
   * Recurso reactivo para obtener el usuario autenticado
   * Utiliza rxResource para manejar el estado de carga y errores automáticamente
   */
  public readonly usersRs = rxResource<User, void>({
    loader: () =>
      this.authService.getUserObservable().pipe(
        tap((user) => console.debug('Usuario obtenido:', user)), // Opcional: para debugging
      ),
  });

  /**
   * Calcula las iniciales del usuario para mostrarlas en el avatar
   * @returns String con las iniciales (ej. "JP" para Juan Pérez)
   */
  public readonly nameAvatar = computed(() => {
    const user = this.usersRs.value();

    if (!user) return '';

    const nameInitial = user.name?.charAt(0)?.toUpperCase() || '';
    const surnameInitial =
      user.paternal_surname?.charAt(0)?.toUpperCase() || '';

    return `${nameInitial}${surnameInitial}`;
  });
}
