/** Componente para actualizar un banner */
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

import { BannerService } from '@services/banner.service';
import { ToastService } from '@services/toast.service';
import { Banner } from '@interfaces/Banner';
import { rxResource } from '@angular/core/rxjs-interop';
import { UploadSimpleImgComponent } from '@shared/upload-simple-img/upload-simple-img.component';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import dayjs from 'dayjs/esm';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Interfaz para errores HTTP esperados
interface HttpValidationError {
  status: number;
  error: {
    errors: { [key: string]: string[] };
  };
}

@Component({
  selector: 'app-update-banner',
  imports: [ReactiveFormsModule, UploadSimpleImgComponent, BsDatepickerModule],
  templateUrl: './update-banner.component.html',
  styleUrl: './update-banner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateBannerComponent {
  // Servicios inyectados
  private readonly bannerService = inject(BannerService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly scroller = inject(ViewportScroller);
  private readonly bsLocaleService = inject(BsLocaleService);

  // Referencia al componente de carga de imágenes
  public uploadSimpleFileImg =
    viewChild.required<UploadSimpleImgComponent>('uploadSimpleImgRef');

  // Estado de carga y errores
  public loading = signal(false);
  public errorMessage = signal<string[]>([]);

  // ID del banner desde la URL
  public readonly bannerId = signal<number>(
    Number(this.route.snapshot.paramMap.get('id')),
  );

  // Estado local del banner cargado
  public bannerResource = signal<Banner | null>(null);

  // Recurso reactivo usando rxResource
  public bannerLoader = rxResource<Banner, void>({
    loader: () =>
      this.bannerService
        .getBannerById(this.bannerId())
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
  private setData(banner: Banner): void {
    this.bannerResource.set(banner);

    this.form.patchValue({
      title: banner.title,
      date_expiration: banner.date_expiration,
      status: banner.status,
      link: banner.link || '',
    });
  }

  /** Envía el formulario si es válido */
  public onSubmit(): void {
    if (!this.validateForm()) return;

    this.loading.set(true);
    this.clearMessages();

    const formData = this.buildFormData();

    this.bannerService
      .updateBanner(this.bannerId(), formData)
      .pipe(
        take(1),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (success: string) => this.handleSuccess(success),
        error: (error: HttpValidationError) => this.handleError(error),
      });
  }

  /** Formatea la fecha para el backend */
  private formatDate(date: any): string {
    if (
      typeof date === 'string' &&
      dayjs(date, 'DD-MM-YYYY HH:mm:ss', true).isValid()
    ) {
      return dayjs(date, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm');
    }

    const parsedDate = dayjs(date);
    if (parsedDate.isValid()) {
      return parsedDate.format('YYYY-MM-DD HH:mm');
    }

    return 'Formato de fecha no válido';
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

    const image = this.uploadSimpleFileImg().getFile();
    if (image) {
      formData.append('image', image);
    }

    return formData;
  }

  // Maneja una respuesta exitosa del backend
  private handleSuccess(success: string): void {
    this.toastService.success(success);
    this.router.navigate(['/admin/banners']);
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
