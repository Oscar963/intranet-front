import { UserService } from './../../../../services/user.service';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NotificationService } from '../../../../services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-password',
  imports: [ReactiveFormsModule, BsDatepickerModule],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.css',
})
export class UpdatePasswordComponent {
  private userService = inject(UserService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public loading: boolean = false;
  public errorMessage: string = '';
  public successMessage: string = '';
  public showPassword: boolean = true;
  public userId!: number;

  form: FormGroup = new FormGroup({
    current_password: new FormControl('', [Validators.required]),
    new_password: new FormControl(this.generatePassword(), [
      Validators.required,
      Validators.minLength(8),
      this.passwordValidator(),
    ]),
  });

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
  }

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
    formData.append('new_password', this.form.value.new_password);
    formData.append('current_password', this.form.value.current_password);

    this.userService
      .updatePassword(formData)
      .subscribe({
        next: (success: string) => {
          this.form.reset();
          this.notificationService.showSuccess(success); // Mostrar mensaje de éxito
          this.router.navigate(['/admin/dashboard']);
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

  processErrors(errors: { [key: string]: string[] }): string {
    const errorList = Object.keys(errors)
      .flatMap((key) => errors[key])
      .map((error) => `${error}</br>`)
      .join('');
    return `${errorList}`;
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
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

  generatePassword(): string {
    const length = 12; // Longitud de la contraseña generada
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*(),.?":{}|<>';
    const allChars =
      upperCaseChars + lowerCaseChars + numberChars + specialChars;

    // Asegurar al menos un carácter de cada tipo
    const getRandomChar = (chars: string) =>
      chars.charAt(Math.floor(Math.random() * chars.length));
    const upperCase = getRandomChar(upperCaseChars);
    const lowerCase = getRandomChar(lowerCaseChars);
    const number = getRandomChar(numberChars);
    const special = getRandomChar(specialChars);

    // Rellenar el resto de la contraseña con caracteres aleatorios
    let password = upperCase + lowerCase + number + special;
    for (let i = password.length; i < length; i++) {
      password += getRandomChar(allChars);
    }

    // Mezclar los caracteres para mayor aleatoriedad
    return password
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');
  }

  copyToClipboard(text: string): void {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert('Contraseña copiada al portapapeles.');
        this.notificationService.showSuccess(
          'Contraseña copiada al portapapeles.'
        );
      })
      .catch((err) => {
        this.notificationService.showError('Error al copiar la contraseña.');
        console.error('Error al copiar al portapapeles:', err);
      });
  }
}
