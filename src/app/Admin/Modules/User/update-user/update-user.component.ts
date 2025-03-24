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

import { UserService } from '../../../../services/user.service';
import { NotificationService } from '../../../../services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-user',
  imports: [ReactiveFormsModule],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css',
})
export class UpdateUserComponent {
  private userService = inject(UserService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public loading: boolean = false;
  public errorMessage: string = '';
  public successMessage: string = '';
  public userId!: number;

  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    paternal_surname: new FormControl('', [Validators.required]),
    maternal_surname: new FormControl('', [Validators.required]),
    rut: new FormControl('', [Validators.required, RutValidator]),
    email: new FormControl('', [Validators.required, Validators.email]),
    status: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadUserData();
  }

  private loadUserData(): void {
    this.loading = true;
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.form.patchValue({
          name: user.name,
          rut: user.rut,
          paternal_surname: user.paternal_surname,
          maternal_surname: user.maternal_surname,
          email: user.email,
          status: user.status,
        });
      },
      error: (error) => {
        this.errorMessage = 'No se pudieron cargar los datos del usuario.';
      },
      complete: () => {
        this.loading = false;
      },
    });
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
    formData.append('_method', 'PUT');
    formData.append('name', this.form.value.name);
    formData.append('paternal_surname', this.form.value.paternal_surname);
    formData.append('maternal_surname', this.form.value.maternal_surname);
    formData.append('rut', this.form.value.rut);
    formData.append('email', this.form.value.email);
    formData.append('status', this.form.value.status);

    this.userService
      .updateUser(this.userId, formData)
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

  processErrors(errors: { [key: string]: string[] }): string {
    const errorList = Object.keys(errors)
      .flatMap((key) => errors[key])
      .map((error) => `${error}</br>`)
      .join('');
    return `${errorList}`;
  }
}

export const RutValidator: ValidatorFn = (
  control: AbstractControl,
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
