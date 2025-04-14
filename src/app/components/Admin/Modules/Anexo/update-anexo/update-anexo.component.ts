/** Componente para actualizar un anexo */
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { take, finalize, tap } from 'rxjs';

import { AnexoService } from '@services/anexo.service';
import { ToastService } from '@services/toast.service';
import { Anexo } from '@interfaces/Anexo';
import { rxResource } from '@angular/core/rxjs-interop';

// Interfaz para errores HTTP esperados
interface HttpValidationError {
  status: number;
  error: {
    errors: { [key: string]: string[] };
  };
}

@Component({
  selector: 'app-update-anexo',
  imports: [ReactiveFormsModule],
  templateUrl: './update-anexo.component.html',
  styleUrl: './update-anexo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateAnexoComponent {
  // Servicios inyectados
  private readonly anexoService = inject(AnexoService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly scroller = inject(ViewportScroller);

  // Estado de carga y errores
  public loading = signal(false);
  public errorMessage = signal<string[]>([]);

  // ID del anexo desde la URL
  public readonly anexoId = signal<number>(
    Number(this.route.snapshot.paramMap.get('id')),
  );

  // Estado local del anexo cargado
  public anexoResource = signal<Anexo | null>(null);

  // Recurso reactivo usando rxResource
  public anexoLoader = rxResource<Anexo, void>({
    loader: () =>
      this.anexoService
        .getAnexoById(this.anexoId())
        .pipe(tap((response) => this.setData(response))),
  });

  // Formulario reactivo
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

  /** Guarda los datos en el signal y rellena el formulario */
  private setData(anexo: Anexo): void {
    this.anexoResource.set(anexo);

    this.form.patchValue({
      internal_number: anexo.internal_number.toString(),
      external_number: anexo.external_number.toString(),
      office: anexo.office || '',
      unit: anexo.unit || '',
      person: anexo.person || '',
    });
  }

  /** Envía el formulario si es válido */
  public onSubmit(): void {
    if (!this.validateForm()) return;

    this.loading.set(true);
    this.clearMessages();

    const formData = this.buildFormData();

    this.anexoService
      .updateAnexo(this.anexoId(), formData)
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
