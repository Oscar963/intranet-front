import { Component, inject, signal, ViewChild } from '@angular/core';
import { UploadSimpleImgComponent } from '@shared/upload-simple-img/upload-simple-img.component';
import { Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { BannerService } from '@services/banner.service';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { Router } from '@angular/router';
import { ToastService } from '@services/toast.service';

import { take } from 'rxjs';
import dayjs from 'dayjs/esm';

@Component({
  selector: 'app-store-banner',
  imports: [UploadSimpleImgComponent, ReactiveFormsModule, BsDatepickerModule],
  templateUrl: './store-banner.component.html',
  styleUrl: './store-banner.component.css',
})
export class StoreBannerComponent {
  // Referencia al componente de subida de imágenes.
  // Se usa para obtener la imagen seleccionada.
  @ViewChild(UploadSimpleImgComponent)
  UploadSimpleImg!: UploadSimpleImgComponent;

  //Inyección de servicios usando la nueva API de Angular.
  private bannerService = inject(BannerService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // Variables de estado reactivas
  public loading = signal(false);
  public errorMessage = signal<string>('');

  constructor(private bsLocaleService: BsLocaleService) {
    // Configura el idioma del datepicker
    defineLocale('es', esLocale);
    this.bsLocaleService.use('es');
  }

  // Definición del formulario con validaciones
  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    date_expiration: ['', Validators.required],
    status: ['', Validators.required],
    link: '',
  });

  //Maneja el envío del formulario.
  //Valida el formulario, construye los datos y los envía al backend.
  onSubmit(): void {
    if (!this.validateForm()) return;
    this.loading.set(true);
    this.clearMessages();

    const formData = this.buildFormData();

    this.bannerService
      .storeBanner(formData)
      .pipe(take(1))
      .subscribe({
        next: (success: string) => this.handleSuccess(success),
        error: (error) => this.handleError(error),
        complete: () => this.loading.set(false),
      })
      .add(() => {
        this.loading.set(false);
      });
  }

  // Limpia los mensajes de error y éxito
  private clearMessages(): void {
    this.errorMessage.set('');
  }

  // Construye los datos a enviar en `FormData`
  private buildFormData(): FormData {
    const formData = new FormData();
    formData.append('title', this.form.value.title!);
    formData.append(
      'date_expiration',
      this.formatDateToInternal(this.form.value.date_expiration!),
    );
    formData.append('status', this.form.value.status!);
    formData.append('link', this.form.value.link!);

    // Agregar la imagen si está disponible
    const image = this.UploadSimpleImg.getFile();
    if (image) formData.append('image', image);

    return formData;
  }

  // Maneja la respuesta exitosa del backend
  private handleSuccess(success: string): void {
    this.resetForm();
    this.toastService.success(success);
    this.router.navigate(['/admin/banners']);
  }

  // Valida el formulario antes de enviarlo
  private validateForm(): boolean {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.errorMessage.set('Por favor, complete todos los campos requeridos.');
      return false;
    }
    return true;
  }

  // Maneja los errores del backend
  private handleError(error: any): void {
    if (error.status === 422) {
      this.errorMessage.set(this.processErrors(error.error.errors));
      window.scroll(0, 0);
    } else {
      this.errorMessage.set(error);
    }
  }

  // Reinicia el formulario y limpia los archivos
  private resetForm(): void {
    this.form.reset();
    this.UploadSimpleImg.removeAllFiles();
  }

  // Procesa los errores de validación del backend
  private processErrors(errors: { [key: string]: string[] }): string {
    const errorList = Object.keys(errors)
      .flatMap((key) => errors[key])
      .map((error) => `${error}</br>`)
      .join('');
    return `${errorList}`;
  }

  // Maneja el cambio de fecha en el datepicker
  public onDateChange(value: any): void {
    if (value) {
      const formattedDate = this.formatDateToInternal(value);
      this.form.value.date_expiration = formattedDate;
    }
  }

  // Convierte la fecha al formato interno deseado
  private formatDateToInternal(date: any): string {
    return dayjs(date).format('YYYY-MM-DD HH:mm');
  }
}
