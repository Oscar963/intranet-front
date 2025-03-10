import { Component, inject, ViewChild } from '@angular/core';
import { UploadSimpleImgComponent } from '../../../../Utils/upload-simple-img/upload-simple-img.component';
import { TinymceComponent } from '../../../../Utils/tinymce/tinymce.component';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import dayjs from 'dayjs/esm';

import { PageService } from '../../../../services/page.service';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { NotificationService } from '../../../../services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store-page',
  imports: [
    UploadSimpleImgComponent,
    ReactiveFormsModule,
    BsDatepickerModule,
    TinymceComponent,
  ],
  templateUrl: './store-page.component.html',
  styleUrl: './store-page.component.css',
})
export class StorePageComponent {
  @ViewChild(UploadSimpleImgComponent)
  UploadSimpleImg!: UploadSimpleImgComponent;

  private pageService = inject(PageService);
  private notificationService = inject(NotificationService);
  public router = inject(Router);

  constructor(private bsLocaleService: BsLocaleService) {
    defineLocale('es', esLocale);
    this.bsLocaleService.use('es'); //fecha en español, datepicker
  }

  public textContent: string = ''; // Contenido inicial
  public customOptions = {
    height: 500, // Altura personalizada
    menubar: true, // Mostrar la barra de menús
  };

  public loading: boolean = false;
  public errorMessage: string = '';
  public successMessage: string = '';
  public showPassword: boolean = false;

  form: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    content: new FormControl(''),
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
      window.scroll(0, 0);
      return;
    }

    const formData = new FormData();
    formData.append('title', this.form.value.title);
    formData.append('status', this.form.value.status);
    formData.append('content', this.form.value.content);

    // Obtener el archivo desde Dropzone
    const image = this.UploadSimpleImg.getFile();
    if (image) {
      formData.append('image', image);
    } else {
      //   console.error('No hay image seleccionada');
    }

    this.pageService
      .storePage(formData)
      .subscribe({
        next: (success: string) => {
          this.form.reset();
          this.UploadSimpleImg.removeAllFiles();
          this.notificationService.showSuccess(success); // Mostrar mensaje de éxito
          this.router.navigate(['/admin/pages']);
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

  onContentChange(content: string): void {
    this.form.value.content = content;
  }

  // Método para convertir la fecha a formato interno usando dayjs
  private formatDateToInternal(date: any): string {
    return dayjs(date).format('YYYY-MM-DD HH:mm');
  }
}
