/** Componente para actualizar un popup */
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { take, finalize, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import dayjs from 'dayjs/esm';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { PopupService } from '@services/popup.service';
import { ToastService } from '@services/toast.service';
import { Popup } from '@interfaces/Popup';
import { UploadSimpleImgComponent } from '@shared/upload-simple-img/upload-simple-img.component';

// Interfaz para errores HTTP esperados
interface HttpValidationError {
  status: number;
  error: {
    errors: { [key: string]: string[] };
  };
}

@Component({
  selector: 'app-update-popup',
  imports: [UploadSimpleImgComponent, ReactiveFormsModule, BsDatepickerModule],
  templateUrl: './update-popup.component.html',
  styleUrl: './update-popup.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePopupComponent {
  // Servicios inyectados
  private readonly popupService = inject(PopupService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly scroller = inject(ViewportScroller);
  private readonly bsLocaleService = inject(BsLocaleService);

  // Referencias a componentes hijos
  public uploadSimpleImg =
    viewChild.required<UploadSimpleImgComponent>('uploadSimpleImgRef');

  // Estado de carga y errores
  public loading = signal(false);
  public errorMessage = signal<string[]>([]);

  // ID del popup desde la URL
  public readonly popupId = signal<number>(
    Number(this.route.snapshot.paramMap.get('id')),
  );

  // Estado local del popup cargado
  public popupResource = signal<Popup | null>(null);

  // Recurso reactivo usando rxResource
  public popupLoader = rxResource<Popup, void>({
    loader: () =>
      this.popupService
        .getPopupById(this.popupId())
        .pipe(tap((response) => this.setData(response))),
  });

  // Formulario reactivo
  public form = this.fb.nonNullable.group({
    title: this.fb.nonNullable.control('', Validators.required),
    date_expiration: this.fb.nonNullable.control('', Validators.required),
    status: this.fb.nonNullable.control('', Validators.required),
    link: this.fb.nonNullable.control(''),
  });

  constructor() {
    defineLocale('es', esLocale);
    this.bsLocaleService.use('es');
    dayjs.extend(customParseFormat);
  }

  /** Guarda los datos en el signal y rellena el formulario */
  private setData(popup: Popup): void {
    this.popupResource.set(popup);

    this.form.patchValue({
      title: popup.title,
      date_expiration: popup.date_expiration,
      status: popup.status,
      link: popup.link || '',
    });
  }

  /** Envía el formulario si es válido */
  public onSubmit(): void {
    if (!this.validateForm()) return;

    this.loading.set(true);
    this.clearMessages();

    const formData = this.buildFormData();

    this.popupService
      .updatePopup(this.popupId(), formData)
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
    formData.append('title', controls.title.value);
    formData.append(
      'date_expiration',
      this.formatDate(controls.date_expiration.value),
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
    this.resetForm();
    this.toastService.success(success);
    this.router.navigate(['/admin/popups']);
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

  // Resetea el formulario
  private resetForm(): void {
    this.form.reset();
    this.uploadSimpleImg().removeAllFiles();
  }

  /**
   * Formatea la fecha para el backend
   * @param date - Fecha a formatear
   * @returns Fecha formateada en formato 'YYYY-MM-DD HH:mm'
   */
  private formatDate(date: any): string {
    if (
      typeof date === 'string' &&
      dayjs(date, 'DD-MM-YYYY HH:mm:ss', true).isValid()
    ) {
      return dayjs(date, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm');
    }

    const fechaParseada = dayjs(date);
    if (fechaParseada.isValid()) {
      return fechaParseada.format('YYYY-MM-DD HH:mm');
    }

    return 'Formato de fecha no válido';
  }
}
