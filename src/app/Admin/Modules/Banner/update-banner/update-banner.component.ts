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

import { BannerService } from '../../../../core/services/banner.service';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-banner',
  imports: [UploadSimpleImgComponent, ReactiveFormsModule, BsDatepickerModule],
  templateUrl: './update-banner.component.html',
  styleUrl: './update-banner.component.css',
})
export class UpdateBannerComponent {
  @ViewChild(UploadSimpleImgComponent)
  UploadSimpleImg!: UploadSimpleImgComponent;

  private bannerService = inject(BannerService);
  private notificationService = inject(NotificationService);
  public router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor(private bsLocaleService: BsLocaleService) {
    defineLocale('es', esLocale);
    dayjs.extend(customParseFormat);
    this.bsLocaleService.use('es'); // Fecha en español, datepicker
  }

  public loading: boolean = false;
  public errorMessage: string = '';
  public successMessage: string = '';
  public bannerId!: number; // ID del banner a actualizar

  form: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    date_expiration: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    link: new FormControl(''),
  });

  ngOnInit(): void {
    // Obtener el ID del banner desde la URL
    this.bannerId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadBannerData();
  }

  // Cargar datos del banner existente
  private loadBannerData(): void {
    this.loading = true;
    this.bannerService.getBannerById(this.bannerId).subscribe({
      next: (banner) => {        
        this.form.patchValue({
          title: banner.title,
          date_expiration: dayjs(
            banner.date_expiration,
            'DD-MM-YYYY HH:mm:ss'
          ).format('YYYY-MM-DD HH:mm'),
          status: banner.status,
          link: banner.link,
        });
      },
      error: (error) => {
        this.errorMessage = 'No se pudieron cargar los datos del banner.';
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
    this.bannerService
      .updateBanner(this.bannerId, formData)
      .subscribe({
        next: (success: string) => {
          this.notificationService.showSuccess(success); // Mostrar mensaje de éxito
          this.router.navigate(['/admin/banners']);
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
