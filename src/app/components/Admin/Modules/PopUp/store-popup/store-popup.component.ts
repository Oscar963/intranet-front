/** Componente para crear un nuevo popup */
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { take, finalize } from 'rxjs';

// Componentes de terceros
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import dayjs from 'dayjs/esm';

// Componentes y servicios locales
import { PopupService } from '@services/popup.service';
import { ToastService } from '@services/toast.service';
import { UploadSimpleImgComponent } from '@shared/upload-simple-img/upload-simple-img.component';

// Interfaz para errores HTTP esperados
interface HttpValidationError {
  status: number;
  error: {
    errors: { [key: string]: string[] };
  };
}

@Component({
  selector: 'app-store-popup',
  imports: [UploadSimpleImgComponent, ReactiveFormsModule, BsDatepickerModule],
  templateUrl: './store-popup.component.html',
  styleUrl: './store-popup.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorePopupComponent {
  // Referencias a componentes
  public uploadSimpleImg =
    viewChild.required<UploadSimpleImgComponent>('uploadSimpleImgRef');

  // Servicios inyectados
  private readonly popupService = inject(PopupService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly scroller = inject(ViewportScroller);
  private readonly bsLocaleService = inject(BsLocaleService);

  // Estado de carga y mensajes de error
  public loading = signal(false);
  public errorMessage = signal<string[]>([]);

  // Formulario reactivo para el popup (usando signals)
  public form = this.fb.nonNullable.group({
    title: this.fb.nonNullable.control('', Validators.required),
    date_expiration: this.fb.nonNullable.control('', Validators.required),
    status: this.fb.nonNullable.control('', Validators.required),
    link: this.fb.nonNullable.control(''),
  });

  constructor() {
    defineLocale('es', esLocale);
    this.bsLocaleService.use('es');
  }

  /** Envía el formulario si es válido */
  public onSubmit(): void {
    if (!this.validateForm()) return;

    this.loading.set(true);
    this.clearMessages();

    const formData = this.buildFormData();

    this.popupService
      .storePopup(formData)
      .pipe(
        take(1),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (success: string) => this.handleSuccess(success),
        error: (error: HttpValidationError) => this.handleError(error),
      });
  }

  /** Maneja el cambio de fecha en el datepicker */
  public onDateChange(value: any): void {
    if (value) {
      this.form
        .get('date_expiration')
        ?.setValue(this.formatDateToInternal(value));
    }
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
    this.uploadSimpleImg().removeAllFiles();
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

    formData.append('title', controls.title.value);
    formData.append(
      'date_expiration',
      this.formatDateToInternal(controls.date_expiration.value),
    );
    formData.append('status', controls.status.value);
    formData.append('link', controls.link.value);

    const image = this.uploadSimpleImg().getFile();
    if (image) {
      formData.append('image', image);
    }

    return formData;
  }

  // Maneja una respuesta exitosa del backend
  private handleSuccess(success: string): void {
    this.toastService.success(success);
    this.router.navigate(['/admin/popups']);
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

  // Formatea la fecha al formato interno
  private formatDateToInternal(date: any): string {
    return dayjs(date).format('YYYY-MM-DD HH:mm');
  }
}
