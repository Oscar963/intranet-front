import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { UserService } from '@services/user.service';
import { ToastService } from '@app/core/services/toast.service';

/**
 * Componente para la actualización de contraseña de usuario.
 * Permite cambiar la contraseña actual por una nueva con validación de seguridad.
 */
@Component({
  selector: 'app-update-password',
  imports: [ReactiveFormsModule, BsDatepickerModule],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePasswordComponent {
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
    current_password: new FormControl('', [Validators.required]),
    new_password: new FormControl(this.generatePassword(), [
      Validators.required,
      Validators.minLength(8),
      this.passwordValidator(),
    ]),
  });

  /**
   * Procesa el envío del formulario de actualización de contraseña.
   */
  public onSubmit(): void {
    if (!this.validateForm()) return;
    this.loading.set(true);
    this.clearMessages();

    const formData = this.buildFormData();

    this.userService.updatePassword(formData).subscribe({
      next: (success: string) => this.handleSuccess(success),
      error: (error) => this.handleError(error),
      complete: () => this.loading.set(false),
    });
  }

  /**
   * Alterna la visibilidad de la contraseña.
   */
  public toggleShowPassword(): void {
    this.showPassword.set(!this.showPassword());
  }

  /**
   * Copia una cadena de texto al portapapeles.
   * @param text - Texto a copiar
   */
  public copyToClipboard(text: string): void {
    navigator.clipboard
      .writeText(text)
      .then(() =>
        this.toastService.success('Contraseña copiada al portapapeles.'),
      )
      .catch(() => this.toastService.error('Error al copiar la contraseña.'));
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
    const symbols = '!@#$%^&*(),.?":{}|<>';
    const allChars = upper + lower + numbers + symbols;

    const getRandomChar = (chars: string) =>
      chars.charAt(Math.floor(Math.random() * chars.length));

    let password = [
      getRandomChar(upper),
      getRandomChar(lower),
      getRandomChar(numbers),
      getRandomChar(symbols),
    ].join('');

    for (let i = password.length; i < length; i++) {
      password += getRandomChar(allChars);
    }

    return password
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');
  }

  // Métodos privados

  private validateForm(): boolean {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.errorMessage.set('Por favor, complete todos los campos requeridos.');
      window.scroll(0, 0);
      this.loading.set(false);
      return false;
    }

    return true;
  }

  private clearMessages(): void {
    this.errorMessage.set('');
  }

  private buildFormData(): FormData {
    const formData = new FormData();
    formData.append('new_password', this.form.value.new_password!);
    formData.append('current_password', this.form.value.current_password!);
    return formData;
  }

  private handleSuccess(success: string): void {
    this.form.reset();
    this.toastService.success(success);
    this.router.navigate(['/admin/dashboard']);
  }

  private handleError(error: any): void {
    if (error.status === 422) {
      this.errorMessage.set(this.processErrors(error.error.errors));
      window.scroll(0, 0);
    } else {
      this.errorMessage.set(error);
    }
  }

  private processErrors(errors: { [key: string]: string[] }): string {
    return Object.keys(errors)
      .flatMap((key) => errors[key])
      .map((err) => `${err}</br>`)
      .join('');
  }

  private passwordValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;

      const hasUpper = /[A-Z]/.test(password);
      const hasLower = /[a-z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      if (hasUpper && hasLower && hasNumber && hasSymbol) {
        return null;
      }

      return {
        passwordStrength:
          'La contraseña debe contener al menos: 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.',
      };
    };
  }
}
