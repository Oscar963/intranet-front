/** Componente para crear un nuevo anexo */
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

import { AnexoService } from '@services/anexo.service';
import { ToastService } from '@services/toast.service';

// Interfaz para errores HTTP esperados
interface HttpValidationError {
  status: number;
  error: {
    errors: { [key: string]: string[] };
  };
}

@Component({
  selector: 'app-store-anexo',
  imports: [ReactiveFormsModule],
  templateUrl: './store-anexo.component.html',
  styleUrl: './store-anexo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreAnexoComponent {
  // Servicios inyectados
  private readonly anexoService = inject(AnexoService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly scroller = inject(ViewportScroller);

  // Estado de carga y mensajes de error
  public loading = signal(false);
  public errorMessage = signal<string[]>([]);

  // Formulario reactivo para el anexo (usando signals)
  public form = this.fb.nonNullable.group({
    internal_number: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(4),
      Validators.pattern(/^\d{1,9}$/),
    ]),
    external_number: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(9),
      Validators.pattern(/^\d{1,9}$/),
    ]),
    office: this.fb.nonNullable.control('', Validators.maxLength(100)),
    unit: this.fb.nonNullable.control('', Validators.maxLength(100)),
    person: this.fb.nonNullable.control('', Validators.maxLength(100)),
  });

  /** Envía el formulario si es válido */
  public onSubmit(): void {
    if (!this.validateForm()) return;

    this.loading.set(true);
    this.clearMessages();

    const formData = this.buildFormData();

    this.anexoService
      .storeAnexo(formData)
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

    formData.append('internal_number', controls.internal_number.value);
    formData.append('external_number', controls.external_number.value);
    formData.append('office', controls.office.value);
    formData.append('unit', controls.unit.value);
    formData.append('person', controls.person.value);

    return formData;
  }

  // Maneja una respuesta exitosa del backend
  private handleSuccess(success: string): void {
    this.toastService.success(success);
    this.router.navigate(['/admin/anexos']);
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
