import { Component, inject, ViewChild } from '@angular/core';
import { UploadSimpleImgComponent } from '../../../../Utils/upload-simple-img/upload-simple-img.component';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import dayjs from 'dayjs/esm';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { PopupService } from '../../../../services/popup.service';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../../services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-popup',
  imports: [UploadSimpleImgComponent, ReactiveFormsModule, BsDatepickerModule],
  templateUrl: './update-popup.component.html',
  styleUrl: './update-popup.component.css',
})
export class UpdatePopupComponent {
  @ViewChild(UploadSimpleImgComponent)
  UploadSimpleImg!: UploadSimpleImgComponent;

  private popupService = inject(PopupService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor(private bsLocaleService: BsLocaleService) {
    defineLocale('es', esLocale);
    dayjs.extend(customParseFormat);
    this.bsLocaleService.use('es'); // Fecha en español, datepicker
  }

  public loading: boolean = false;
  public errorMessage: string = '';
  public successMessage: string = '';
  public popupId!: number;

  form: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    date_expiration: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    link: new FormControl(''),
  });

  ngOnInit(): void {
    this.popupId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPopupData();
  }

  private loadPopupData(): void {
    this.loading = true;
    this.popupService.getPopupById(this.popupId).subscribe({
      next: (popup) => {
        this.form.patchValue({
          title: popup.title,
          date_expiration: dayjs(
            popup.date_expiration,
            'DD-MM-YYYY HH:mm:ss'
          ).format('YYYY-MM-DD HH:mm'),
          status: popup.status,
          link: popup.link,
        });
      },
      error: (error) => {
        this.errorMessage = 'No se pudieron cargar los datos del popup.';
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos requeridos.';
      this.loading = false;
      return;
    }

    const formData = new FormData();
    formData.append('title', this.form.value.title);
    formData.append('_method', 'PUT');
    formData.append(
      'date_expiration',
      this.formatDateToInternal(this.form.value.date_expiration)
    );
    formData.append('status', this.form.value.status);
    formData.append('link', this.form.value.link);

    const image = this.UploadSimpleImg.getFile();
    if (image) {
      formData.append('image', image);
    } else {
      //   console.error('No hay imagen seleccionada');
    }

    // Llamar al servicio de actualización
    this.popupService
      .updatePopup(this.popupId, formData)
      .subscribe({
        next: (success: string) => {
          this.notificationService.showSuccess(success); // Mostrar mensaje de éxito
          this.router.navigate(['/admin/popups']);
        },
        error: (error) => {
          if (error.status === 422) {
            this.errorMessage = this.processErrors(error.error.errors);
          } else {
            this.errorMessage = error;
          }
          window.scroll(0, 0);
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
      this.form.value.date_expiration = this.formatDateToInternal(value);
    }
  }

  private formatDateToInternal(date: any): string {
    return dayjs(date).format('YYYY-MM-DD HH:mm');
  }
}
