import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { User } from '@interfaces/User';
import { AuthService } from '@services/auth.service';

const ERROR_MESSAGES = {
  UNKNOWN_ERROR: 'Error desconocido al cerrar sesión',
} as const;

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  // Services
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Inputs
  public avatarName = input.required<string>();
  public user = input<User | null>();

  // State
  public loading = signal(false);
  public errorMessage = signal('');

  // Computed
  public isLogoutDisabled = computed(
    () => this.loading() || this.errorMessage() !== '',
  );

  /**
   * Cierra la sesión del usuario y redirige al inicio
   */
  async logout(): Promise<void> {
    this.setInitialState();

    try {
      await firstValueFrom(this.authService.logout());
      await this.router.navigate(['/']);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.loading.set(false);
    }
  }

  private setInitialState(): void {
    this.loading.set(true);
    this.errorMessage.set('');
  }

  private handleError(error: unknown): void {
    this.errorMessage.set(this.formatErrorMessage(error));
    console.error('Logout error:', error);
  }

  private formatErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return ERROR_MESSAGES.UNKNOWN_ERROR;
  }
}
