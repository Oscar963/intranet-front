import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { User } from '@interfaces/User';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  // Inyección de dependencias
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Propiedades de entrada
  public nameAvatar = input.required<string>();
  public user = input<User | null>();

  // Estados reactivos
  public loading = signal<boolean>(false);
  public errorMessage = signal<string>('');

  /**
   * Maneja el cierre de sesión del usuario
   * Actualiza los estados de carga y errores durante el proceso
   */
  logout(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.logout().subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.message || 'Error al cerrar sesión');
      },
    });
  }
}
