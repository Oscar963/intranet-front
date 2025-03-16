import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  public authService = inject(AuthService);
  public router = inject(Router);

  public loading: boolean = false;
  public validationErrors: string[] = [];
  public showPassword: boolean = false;
  public errorMessage: string = '';
  public successMessage: string = '';

  form = new FormGroup({
    rut: new FormControl('', [Validators.required, RutValidator]),
    password: new FormControl('', [Validators.required]),
    remember: new FormControl(false),
  });

  login(): void {
    if (this.form.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';
      this.validationErrors = [];

      this.authService.getCsrfCookie().subscribe(() => {
        this.authService
          .login(
            this.form.value.rut ?? '',
            this.form.value.password ?? '',
            this.form.value.remember ?? false
          )
          .subscribe({
            next: (response: string) => {
              this.loading = false;
              this.successMessage = response;
              this.router.navigate(['/admin/dashboard']);
            },
            error: (error) => {
              this.loading = false;
              if (error.status === 422) {
                this.errorMessage = this.processErrors(error.error.errors);
              } else {
                this.errorMessage = error;
              }
            },
          });
      });
    }
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  processErrors(errors: { [key: string]: string[] }): string {
    const errorList = Object.keys(errors)
      .flatMap((key) => errors[key])
      .map((error) => `- ${error}</br>`)
      .join('');

    return `${errorList}`;
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
