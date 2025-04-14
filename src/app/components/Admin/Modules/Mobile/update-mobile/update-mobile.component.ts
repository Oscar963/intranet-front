/** Componente para actualizar un móvil */
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { take, finalize, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

import { MobileService } from '@services/mobile.service';
import { ToastService } from '@services/toast.service';
import { Mobile } from '@interfaces/Mobile';

// Interfaz para errores HTTP esperados
interface HttpValidationError {
  status: number;
  error: {
    errors: { [key: string]: string[] };
  };
}

@Component({
  selector: 'app-update-mobile',
  imports: [ReactiveFormsModule],
  templateUrl: './update-mobile.component.html',
  styleUrl: './update-mobile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateMobileComponent {
  // Servicios inyectados
  private readonly mobileService = inject(MobileService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly scroller = inject(ViewportScroller);

  // Estado de carga y errores
  public loading = signal(false);
  public errorMessage = signal<string[]>([]);

  // ID del móvil desde la URL
  public readonly mobileId = signal<number>(
    Number(this.route.snapshot.paramMap.get('id')),
  );

  // Estado local del móvil cargado
  public mobileResource = signal<Mobile | null>(null);

  // Recurso reactivo usando rxResource
  public mobileLoader = rxResource<Mobile, void>({
    loader: () =>
      this.mobileService
        .getMobileById(this.mobileId())
        .pipe(tap((response) => this.setData(response))),
  });

  // Formulario reactivo
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

  /** Guarda los datos en el signal y rellena el formulario */
  private setData(mobile: Mobile): void {
    this.mobileResource.set(mobile);

    this.form.patchValue({
      number: mobile.number.toString(),
      office: mobile.office || '',
      direction: mobile.direction || '',
      person: mobile.person || '',
    });
  }

  /** Envía el formulario si es válido */
  public onSubmit(): void {
    if (!this.validateForm()) return;

    this.loading.set(true);
    this.clearMessages();

    const formData = this.buildFormData();

    this.mobileService
      .updateMobile(this.mobileId(), formData)
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
