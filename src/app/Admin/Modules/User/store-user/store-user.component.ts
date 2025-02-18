import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

import { UserService } from '../../../../core/services/user.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store-user',
  imports: [ReactiveFormsModule],
  templateUrl: './store-user.component.html',
  styleUrl: './store-user.component.css',
})
export class StoreUserComponent {
  private userService = inject(UserService);
  private notificationService = inject(NotificationService);
  public router = inject(Router);

  constructor() {}

  public loading: boolean = false;
  public errorMessage: string = '';
  public successMessage: string = '';
  public showPassword: boolean = false;

  form: FormGroup = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      paternal_surname: new FormControl('', [Validators.required]),
      maternal_surname: new FormControl('', [Validators.required]),
      rut: new FormControl('', [Validators.required, RutValidator]),
      email: new FormControl('', [Validators.required, Validators.email]),
      status: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        this.passwordValidator(),
      ]),
      password_confirmation: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordsMatch.bind(this) }
  );

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.form.markAllAsTouched();
    // Verificar si el formulario es válido antes de enviarlo
    if (this.form.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos requeridos.';
      this.loading = false;
      return;
    }

    const formData = new FormData();
    formData.append('name', this.form.value.name);
    formData.append('paternal_surname', this.form.value.paternal_surname);
    formData.append('maternal_surname', this.form.value.maternal_surname);
    formData.append('rut', this.form.value.rut);
    formData.append('email', this.form.value.email);
    formData.append('status', this.form.value.status);
    formData.append('password', this.form.value.password);
    formData.append(
      'password_confirmation',
      this.form.value.password_confirmation
    );

    this.userService
      .storeUser(formData)
      .subscribe({
        next: (success: string) => {
          this.form.reset();
          this.notificationService.showSuccess(success); // Mostrar mensaje de éxito
          this.router.navigate(['/admin/users']);
        },
        error: (error) => {
          if (error.status === 422) {
            this.errorMessage = this.processErrors(error.error.errors);
            window.scroll(0, 0);
          } else {
            this.errorMessage = error;
          }
        },
      })
      .add(() => {
        this.loading = false;
      });
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('password_confirmation')?.value;
    return password && confirmPassword && password === confirmPassword
      ? null
      : { passwordsNotMatch: 'Las contraseñas no coinciden' };
  }

  processErrors(errors: { [key: string]: string[] }): string {
    const errorList = Object.keys(errors)
      .flatMap((key) => errors[key])
      .map((error) => `${error}</br>`)
      .join('');
    return `${errorList}`;
  }

  passwordValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;

      // Validar que la contraseña tenga al menos una letra mayúscula
      const hasUpperCase = /[A-Z]/.test(password);

      // Validar que la contraseña tenga al menos una letra minúscula
      const hasLowerCase = /[a-z]/.test(password);

      // Validar que la contraseña tenga al menos un número
      const hasNumber = /\d/.test(password);

      // Validar que la contraseña tenga al menos un carácter especial
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      // Verificar que todas las condiciones se cumplan
      if (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) {
        return null; // Si la contraseña cumple con todos los requisitos, es válida
      } else {
        return {
          passwordStrength:
            'La contraseña debe contener al menos: 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.',
        };
      }
    };
  }
}

export const RutValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const rut = control.value;

  if (!rut) {
    return { required: true }; // Si el RUT está vacío.
  }

  const rutRegex = /^[0-9]+-[0-9Kk]$/;
  if (!rutRegex.test(rut)) {
    return { invalidFormat: true };
  }

  // Normalizar el RUT
  const normalizedRut = rut.toUpperCase();
  const digits = normalizedRut.slice(0, -2);
  const dv = normalizedRut.slice(-1);

  let sum = 0;
  let factor = 2;
  for (let i = digits.length - 1; i >= 0; i--) {
    sum += parseInt(digits[i], 10) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }

  const remainder = sum % 11;
  let computedDv = (11 - remainder).toString();

  if (computedDv === '11') {
    computedDv = '0';
  } else if (computedDv === '10') {
    computedDv = 'K';
  }

  if (dv !== computedDv) {
    return { invalidRut: true }; // Error si el RUT no es válido.
  }

  return null;
};
