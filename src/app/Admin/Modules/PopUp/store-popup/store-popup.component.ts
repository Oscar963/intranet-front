import { Component, inject, ViewChild } from '@angular/core';
import { UploadSimpleImgComponent } from '../../../../Utils/upload-simple-img/upload-simple-img.component';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import dayjs from 'dayjs/esm';

import { PopupService } from '../../../../core/services/popup.service';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { NotificationService } from '../../../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store-popup',
  imports: [UploadSimpleImgComponent, ReactiveFormsModule, BsDatepickerModule],
  templateUrl: './store-popup.component.html',
  styleUrl: './store-popup.component.css',
})
export class StorePopupComponent {
  @ViewChild(UploadSimpleImgComponent)
  UploadSimpleImg!: UploadSimpleImgComponent;

  private popupService = inject(PopupService);
  private notificationService = inject(NotificationService);
  public router = inject(Router);

  constructor(private bsLocaleService: BsLocaleService) {
    defineLocale('es', esLocale);
    this.bsLocaleService.use('es'); //fecha en español, datepicker
  }

  public loading: boolean = false;
  public errorMessage: string = '';
  public successMessage: string = '';

  form: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    date_expiration: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    link: new FormControl(''),
  });

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.form.markAllAsTouched();
    // Verificar si el formulario es válido antes de enviarlo
    if (this.form.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos requeridos.';
      this.loading = false;
      return;
    }

    const formData = new FormData();
    formData.append('title', this.form.value.title);
    formData.append(
      'date_expiration',
      this.formatDateToInternal(this.form.value.date_expiration)
    );
    formData.append('status', this.form.value.status);
    formData.append('link', this.form.value.link);

    // Obtener el archivo desde Dropzone
    const image = this.UploadSimpleImg.getFile();
    if (image) {
      formData.append('image', image);
    } else {
      //   console.error('No hay imagen seleccionada');
    }

    this.popupService.storePopup(formData)
      .subscribe({
        next: (success: string) => {
          this.form.reset();
          this.UploadSimpleImg.removeAllFiles();
          this.notificationService.showSuccess(success); // Mostrar mensaje de éxito
          this.router.navigate(['/admin/popups']);
        },
        error: (error) => {
          if (error.status === 422) {
            this.errorMessage = this.processErrors(error.error.errors);
            window.scroll(0, 0);
          } else {
            this.errorMessage = error;
          }
        },
      })
      .add(() => {
        this.loading = false;
      });
  }

  processErrors(errors: { [key: string]: string[] }): string {
    const errorList = Object.keys(errors)
      .flatMap((key) => errors[key])
      .map((error) => `${error}</br>`)
      .join('');
    return `${errorList}`;
  }

  onDateChange(value: any): void {
    if (value) {
      const formattedDate = this.formatDateToInternal(value);
      this.form.value.date_expiration = formattedDate;
    }
  }

  // Método para convertir la fecha a formato interno usando dayjs
  private formatDateToInternal(date: any): string {
    return dayjs(date).format('YYYY-MM-DD HH:mm');
  }
}
