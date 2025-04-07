import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexAdminComponent {
  // === Inyección de dependencias ===
  private readonly authService = inject(AuthService);

  // === Recurso reactivo: Usuario autenticado ===
  public readonly userResource = rxResource<User, void>({
    loader: () =>
      this.authService
        .getUserObservable()
        .pipe(tap((user) => console.debug('Usuario obtenido:', user))),
  });

  // === Valor computado: Iniciales para el avatar ===
  public readonly nameAvatar = computed(() => {
    const user = this.userResource.value();
    return this.getInitialsFromUser(user);
  });

  /**
   * Extrae las iniciales del usuario para el avatar
   * @param user - Objeto usuario o null/undefined
   * @returns Iniciales concatenadas (ej: "JP") o string vacío
   */
  private getInitialsFromUser(user: User | undefined): string {
    if (!user) return '';

    return [
      user.name?.[0]?.toUpperCase(),
      user.paternal_surname?.[0]?.toUpperCase(),
    ]
      .filter(Boolean)
      .join('');
  }
}
