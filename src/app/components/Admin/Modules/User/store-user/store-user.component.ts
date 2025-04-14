/** Componente para crear un nuevo usuario */
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { take, finalize } from 'rxjs';

import { UserService } from '@services/user.service';
import { ToastService } from '@services/toast.service';

// Interfaz para errores HTTP esperados
interface HttpValidationError {
  status: number;
  error: {
    errors: { [key: string]: string[] };
  };
}

@Component({
  selector: 'app-store-user',
  imports: [ReactiveFormsModule],
  templateUrl: './store-user.component.html',
  styleUrl: './store-user.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreUserComponent {
  // Servicios inyectados
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly scroller = inject(ViewportScroller);

  // Estado de carga y mensajes de error
  public loading = signal(false);
  public errorMessage = signal<string[]>([]);
  public showPassword = signal(false);

  // Formulario reactivo para el usuario
  public form = this.fb.nonNullable.group(
    {
      name: this.fb.nonNullable.control('', Validators.required),
      paternal_surname: this.fb.nonNullable.control('', Validators.required),
      maternal_surname: this.fb.nonNullable.control('', Validators.required),
      rut: this.fb.nonNullable.control('', [
        Validators.required,
        this.rutValidator,
      ]),
      email: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.email,
      ]),
      status: this.fb.nonNullable.control('', Validators.required),
      password: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(8),
        this.passwordValidator(),
      ]),
      password_confirmation: this.fb.nonNullable.control('', [
        Validators.required,
      ]),
    },
    { validators: this.passwordsMatch },
  );

  /** Envía el formulario si es válido */
  public onSubmit(): void {
    if (!this.validateForm()) return;

    this.loading.set(true);
    this.clearMessages();

    const formData = this.buildFormData();

    this.userService
      .storeUser(formData)
      .pipe(
        take(1),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (success: string) => this.handleSuccess(success),
        error: (error: HttpValidationError) => this.handleError(error),
      });
  }

  /** Alterna la visibilidad del campo de contraseña */
  public toggleShowPassword(): void {
    this.showPassword.set(!this.showPassword());
  }

  // Limpia los mensajes de error anteriores
  private clearMessages(): void {
    this.errorMessage.set([]);
  }

  // Reinicia el formulario tras éxito
  private resetForm(): void {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  // Valida el formulario y muestra errores si es inválido
  private validateForm(): boolean {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.errorMessage.set([
        'Por favor, complete todos los campos requeridos.',
      ]);
      this.scroller.scrollToPosition([0, 0]);
      return false;
    }
    return true;
  }

  // Construye el FormData para enviar al backend
  private buildFormData(): FormData {
    const formData = new FormData();
    const controls = this.form.controls;

    formData.append('name', controls.name.value);
    formData.append('paternal_surname', controls.paternal_surname.value);
    formData.append('maternal_surname', controls.maternal_surname.value);
    formData.append('rut', controls.rut.value);
    formData.append('email', controls.email.value);
    formData.append('status', controls.status.value);
    formData.append('password', controls.password.value);
    formData.append(
      'password_confirmation',
      controls.password_confirmation.value,
    );

    return formData;
  }

  // Maneja una respuesta exitosa del backend
  private handleSuccess(success: string): void {
    this.toastService.success(success);
    this.router.navigate(['/admin/users']);
    this.resetForm();
  }

  // Procesa errores HTTP y muestra mensajes adecuados
  private handleError(error: HttpValidationError): void {
    if (error.status === 422) {
      this.errorMessage.set(this.processErrors(error.error.errors));
      this.scroller.scrollToPosition([0, 0]);
    } else {
      this.errorMessage.set(['Ocurrió un error inesperado.']);
    }
  }

  // Validador para coincidencia de contraseñas
  private passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmation = control.get('password_confirmation')?.value;
    return password && confirmation && password === confirmation
      ? null
      : { passwordsNotMatch: 'Las contraseñas no coinciden' };
  }

  // Validador para fortaleza de contraseña
  private passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;

      const hasUpper = /[A-Z]/.test(password);
      const hasLower = /[a-z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      return hasUpper && hasLower && hasNumber && hasSpecial
        ? null
        : {
            passwordStrength:
              'La contraseña debe contener al menos: 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.',
          };
    };
  }

  // Validador para formato de RUT chileno
  private rutValidator(control: AbstractControl): ValidationErrors | null {
    const rut = control.value;
    if (!rut) return { required: true };

    const rutRegex = /^[0-9]+-[0-9Kk]$/;
    return rutRegex.test(rut)
      ? null
      : { rutInvalidFormat: 'El RUT debe tener el formato 12345678-9' };
  }

  // Convierte errores de validación a un arreglo de strings
  private processErrors(errors: { [key: string]: string[] }): string[] {
    return Object.values(errors).flat();
  }
}
