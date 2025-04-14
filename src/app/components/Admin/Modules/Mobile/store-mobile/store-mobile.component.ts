/** Componente para crear un nuevo móvil */
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { take, finalize } from 'rxjs';

import { MobileService } from '@services/mobile.service';
import { ToastService } from '@services/toast.service';

// Interfaz para errores HTTP esperados
interface HttpValidationError {
  status: number;
  error: {
    errors: { [key: string]: string[] };
  };
}

@Component({
  selector: 'app-store-mobile',
  imports: [ReactiveFormsModule],
  templateUrl: './store-mobile.component.html',
  styleUrl: './store-mobile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreMobileComponent {
  // Servicios inyectados
  private readonly mobileService = inject(MobileService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly scroller = inject(ViewportScroller);

  // Estado de carga y mensajes de error
  public loading = signal(false);
  public errorMessage = signal<string[]>([]);

  // Formulario reactivo para el móvil (usando signals)
  public form = this.fb.nonNullable.group({
    number: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.pattern(/^\+[1-9]\d{6,14}$/), // formato E.164
      Validators.maxLength(15),
    ]),
    office: this.fb.nonNullable.control('', Validators.maxLength(100)),
    direction: this.fb.nonNullable.control('', Validators.maxLength(100)),
    person: this.fb.nonNullable.control('', Validators.maxLength(100)),
  });

  /** Envía el formulario si es válido */
  public onSubmit(): void {
    if (!this.validateForm()) return;

    this.loading.set(true);
    this.clearMessages();

    const formData = this.buildFormData();

    this.mobileService
      .storeMobile(formData)
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

    formData.append('number', controls.number.value);
    formData.append('office', controls.office.value);
    formData.append('direction', controls.direction.value);
    formData.append('person', controls.person.value);

    return formData;
  }

  // Maneja una respuesta exitosa del backend
  private handleSuccess(success: string): void {
    this.toastService.success(success);
    this.router.navigate(['/admin/mobiles']);
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

  // Convierte errores de validación a un arreglo de strings
  private processErrors(errors: { [key: string]: string[] }): string[] {
    return Object.values(errors).flat();
  }
}
