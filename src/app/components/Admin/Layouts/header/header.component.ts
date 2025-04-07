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
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  // === Inyección de dependencias ===
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // === Inputs ===
  public readonly nameAvatar = input.required<string>();
  public readonly user = input<User | null>();

  // === Estado reactivo ===
  public readonly loading = signal(false);
  public readonly errorMessage = signal('');

  // === Métodos ===
  /**
   * Cierra la sesión del usuario
   */
  public async logout(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set('');

    try {
      await firstValueFrom(this.authService.logout());
      await this.router.navigate(['/']);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error desconocido al cerrar sesión';
      this.errorMessage.set(message);
      console.error('Logout error:', error);
    } finally {
      this.loading.set(false);
    }
  }
}
