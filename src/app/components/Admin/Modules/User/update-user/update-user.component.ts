/** Componente para actualizar un usuario */
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { take, finalize, tap } from 'rxjs';

import { UserService } from '@services/user.service';
import { ToastService } from '@services/toast.service';
import { User } from '@interfaces/User';
import { rxResource } from '@angular/core/rxjs-interop';

// Interfaz para errores HTTP esperados
interface HttpValidationError {
  status: number;
  error: {
    errors: { [key: string]: string[] };
  };
}

@Component({
  selector: 'app-update-user',
  imports: [ReactiveFormsModule],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateUserComponent {
  // Servicios inyectados
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly scroller = inject(ViewportScroller);

  // Estado de carga y errores
  public loading = signal(false);
  public errorMessage = signal<string[]>([]);

  // ID del usuario desde la URL
  public readonly userId = signal<number>(
    Number(this.route.snapshot.paramMap.get('id')),
  );

  // Estado local del usuario cargado
  public userResource = signal<User | null>(null);

  // Recurso reactivo usando rxResource
  public userLoader = rxResource<User, void>({
    loader: () =>
      this.userService
        .getUserById(this.userId())
        .pipe(tap((response) => this.setData(response))),
  });

  // Formulario reactivo
  public form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', Validators.required),
    paternal_surname: this.fb.nonNullable.control('', Validators.required),
    maternal_surname: this.fb.nonNullable.control('', Validators.required),
    rut: this.fb.nonNullable.control('', [
      Validators.required,
      this.rutValidator(),
    ]),
    email: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.email,
    ]),
    status: this.fb.nonNullable.control('', Validators.required),
  });

  /** Guarda los datos en el signal y rellena el formulario */
  private setData(user: User): void {
    this.userResource.set(user);

    this.form.patchValue({
      name: user.name,
      paternal_surname: user.paternal_surname,
      maternal_surname: user.maternal_surname,
      rut: user.rut,
      email: user.email,
      status: user.status,
    });
  }

  /** Envía el formulario si es válido */
  public onSubmit(): void {
    if (!this.validateForm()) return;

    this.loading.set(true);
    this.clearMessages();

    const formData = this.buildFormData();

    this.userService
      .updateUser(this.userId(), formData)
      .pipe(
        take(1),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (success: string) => this.handleSuccess(success),
        error: (error: HttpValidationError) => this.handleError(error),
      });
  }

  // Limpia los mensajes de error anteriores
  private clearMessages(): void {
    this.errorMessage.set([]);
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

    formData.append('_method', 'PUT'); // Laravel necesita esto si usas POST para update
    formData.append('name', controls.name.value);
    formData.append('paternal_surname', controls.paternal_surname.value);
    formData.append('maternal_surname', controls.maternal_surname.value);
    formData.append('rut', controls.rut.value);
    formData.append('email', controls.email.value);
    formData.append('status', controls.status.value);

    return formData;
  }

  // Maneja una respuesta exitosa del backend
  private handleSuccess(success: string): void {
    this.toastService.success(success);
    this.router.navigate(['/admin/users']);
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

  // Convierte errores de validación a un arreglo de strings
  private processErrors(errors: { [key: string]: string[] }): string[] {
    return Object.values(errors).flat();
  }

  // Validador personalizado para RUT chileno
  private rutValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const rut = control.value;
      if (!rut) return { required: true };

      const rutRegex = /^[0-9]+-[0-9Kk]$/;
      if (!rutRegex.test(rut)) return { invalidFormat: true };

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
      if (computedDv === '11') computedDv = '0';
      if (computedDv === '10') computedDv = 'K';

      return dv !== computedDv ? { invalidRut: true } : null;
    };
  }
}
