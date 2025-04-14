import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '@services/user.service';
import { ToastService } from '@app/core/services/toast.service';

/**
 * Componente para la actualización del perfil de usuario.
 * Permite modificar los datos personales del usuario con validación de campos.
 */
@Component({
  selector: 'app-update-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateProfileComponent {
  // Servicios
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  // Estado
  public loading = signal(false);
  public errorMessage = signal<string>('');
  public userId = signal<number>(
    Number(this.route.snapshot.paramMap.get('id')),
  );

  // Formulario
  public form = this.fb.group({
    name: ['', Validators.required],
    paternal_surname: ['', Validators.required],
    maternal_surname: ['', Validators.required],
    rut: ['', [Validators.required, rutValidator()]],
    email: ['', [Validators.required, Validators.email]],
  });

  /**
   * Inicializa el componente y carga los datos del perfil de usuario.
   */
  public ngOnInit(): void {
    this.loadUserData();
  }

  /**
   * Procesa el envío del formulario de actualización de perfil.
   */
  public onSubmit(): void {
    if (!this.validateForm()) return;
    this.loading.set(true);
    this.clearMessages();

    const formData = this.buildFormData();

    this.userService.updateProfile(formData).subscribe({
      next: (success: string) => this.handleSuccess(success),
      error: (error) => this.handleError(error),
      complete: () => this.loading.set(false),
    });
  }

  // Métodos privados

  private loadUserData(): void {
    this.loading.set(true);
    this.userService.getUserProfile().subscribe({
      next: (user) => {
        this.form.patchValue({
          name: user.name,
          paternal_surname: user.paternal_surname,
          maternal_surname: user.maternal_surname,
          rut: user.rut,
          email: user.email,
        });
      },
      error: () => {
        this.errorMessage.set('No se pudieron cargar los datos del usuario.');
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

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

  private buildFormData(): FormData {
    const formData = new FormData();
    formData.append('name', this.form.value.name!);
    formData.append('paternal_surname', this.form.value.paternal_surname!);
    formData.append('maternal_surname', this.form.value.maternal_surname!);
    formData.append('rut', this.form.value.rut!);
    formData.append('email', this.form.value.email!);

    return formData;
  }

  private handleSuccess(success: string): void {
    this.toastService.success(success);
    this.router.navigate(['/admin/users/profile-update']);
  }

  private handleError(error: any): void {
    if (error.status === 422) {
      this.errorMessage.set(this.processErrors(error.error.errors));
      window.scroll(0, 0);
    } else {
      this.errorMessage.set(error);
    }
  }

  private clearMessages(): void {
    this.errorMessage.set('');
  }

  private processErrors(errors: { [key: string]: string[] }): string {
    return Object.keys(errors)
      .flatMap((key) => errors[key])
      .map((err) => `${err}</br>`)
      .join('');
  }
}

/**
 * Validador personalizado para el formato de RUT chileno.
 */
export const rutValidator = (): ValidatorFn => {
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
};
