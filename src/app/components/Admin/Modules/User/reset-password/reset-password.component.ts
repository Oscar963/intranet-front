import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  Validators,
  ReactiveFormsModule,
  FormBuilder,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '@app/core/services/toast.service';

import { UserService } from '@services/user.service';

/**
 * Componente para el restablecimiento de contraseñas de usuarios.
 * Permite generar y establecer nuevas contraseñas seguras con validación.
 */
@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {
  // Servicios
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  // Estado
  public loading = signal(false);
  public errorMessage = signal<string>('');
  public showPassword = signal(true);
  public userId = signal<number>(
    Number(this.route.snapshot.paramMap.get('id')),
  );

  // Formulario
  public form = this.fb.group({
    password: [
      this.generatePassword(),
      [Validators.required, Validators.minLength(8), this.passwordValidator()],
    ],
  });

  /**
   * Procesa el envío del formulario de restablecimiento de contraseña.
   */
  public onSubmit(): void {
    if (!this.validateForm()) return;

    this.loading.set(true);
    this.clearMessages();

    const formData = this.buildFormData();

    this.userService.resetPassword(this.userId(), formData).subscribe({
      next: (success: string) => this.handleSuccess(success),
      error: (error) => this.handleError(error),
      complete: () => this.loading.set(false),
    });
  }

  /**
   * Alterna la visibilidad de la contraseña en el campo de entrada.
   */
  public toggleShowPassword(): void {
    this.showPassword.set(!this.showPassword());
  }

  /**
   * Copia el texto al portapapeles del sistema.
   * @param text - Texto a copiar
   */
  public copyToClipboard(text: string): void {
    navigator.clipboard
      .writeText(text)
      .then(() =>
        this.toastService.success('Contraseña copiada al portapapeles.'),
      )
      .catch((err) => {
        this.toastService.error('Error al copiar la contraseña.');
      });
  }

  /**
   * Limpia los mensajes de error y éxito.
   */
  private clearMessages(): void {
    this.errorMessage.set('');
  }

  /**
   * Valida el formulario antes de enviarlo.
   * @returns true si el formulario es válido, false en caso contrario
   */
  private validateForm(): boolean {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.errorMessage.set('Por favor, complete todos los campos requeridos.');
      window.scroll(0, 0);
      return false;
    }
    return true;
  }

  /**
   * Construye el objeto FormData con los datos del formulario.
   * @returns FormData con los datos del formulario
   */
  private buildFormData(): FormData {
    const formData = new FormData();
    formData.append('_method', 'PUT'); // Laravel necesita esto si usas POST para update
    formData.append('password', this.form.value.password!);
    return formData;
  }

  /**
   * Maneja la respuesta exitosa del servidor.
   * @param success - Mensaje de éxito del servidor
   */
  private handleSuccess(success: string): void {
    this.form.reset();
    this.toastService.success(success);
    this.router.navigate(['/admin/users']);
  }

  /**
   * Maneja los errores de la respuesta del servidor.
   * @param error - Error recibido del servidor
   */
  private handleError(error: any): void {
    if (error.status === 422) {
      this.errorMessage.set(this.processErrors(error.error.errors));
      window.scroll(0, 0);
    } else {
      this.errorMessage.set(error);
    }
  }

  /**
   * Procesa los errores de validación del servidor.
   * @param errors - Objeto con los errores de validación
   * @returns Cadena formateada con los mensajes de error
   */
  private processErrors(errors: { [key: string]: string[] }): string {
    return Object.keys(errors)
      .flatMap((key) => errors[key])
      .map((error) => `${error}</br>`)
      .join('');
  }

  /**
   * Validador personalizado para la fortaleza de la contraseña.
   * @returns Función validadora que verifica los requisitos de la contraseña
   */
  private passwordValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      if (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) {
        return null;
      }
      return {
        passwordStrength:
          'La contraseña debe contener al menos: 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.',
      };
    };
  }

  /**
   * Genera una contraseña aleatoria segura.
   * @returns Cadena con la contraseña generada
   */
  public generatePassword(): string {
    const length = 12;
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*(),.?":{}|<>';
    const all = upper + lower + numbers + special;

    const getRandom = (chars: string) =>
      chars.charAt(Math.floor(Math.random() * chars.length));

    let password =
      getRandom(upper) +
      getRandom(lower) +
      getRandom(numbers) +
      getRandom(special);

    for (let i = password.length; i < length; i++) {
      password += getRandom(all);
    }

    return password
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');
  }
}
