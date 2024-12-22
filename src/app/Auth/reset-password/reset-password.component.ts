import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  public loading: boolean = false;
  public errorMessage: string = '';
  public successMessage: string = '';
  public showPassword: boolean = false;
  public token: string = '';
  public email: string = '';

  form: FormGroup = new FormGroup(
    {
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        this.passwordValidator(),
      ]),

      password_confirmation: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordsMatch.bind(this) }
  );

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  resetPassword(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.token = this.route.snapshot.paramMap.get('token') || '';
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'] || '';
    });

    this.authService
      .resetPassword({
        token: this.token,
        email: this.email,
        password: this.form.value.password,
        password_confirmation: this.form.value.password_confirmation,
      })
      .subscribe({
        next: (response: string) => {
          this.loading = false;
          this.successMessage = response;
          this.form.value.password = '';
          this.form.value.password_confirmation = '';
        },
        error: (error) => {
          this.loading = false;
          if (error.status === 422) {
            this.errorMessage = this.processErrors(error.error.errors);
          } else {
            this.errorMessage = error.error;
          }
        },
      });
  }

  public toggleShowPassword(): void {
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
      .map((error) => `- ${error}</br>`)
      .join('');

    // Retornar el HTML como un string
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

      // Validar que la contraseña tenga una longitud mínima de 8 caracteres
      const isValidLength = password.length >= 8;

      // Verificar que todas las condiciones se cumplan
      if (
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar &&
        isValidLength
      ) {
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
