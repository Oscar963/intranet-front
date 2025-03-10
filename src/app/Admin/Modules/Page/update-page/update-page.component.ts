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
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NotificationService } from '../../../../services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-page',
  imports: [
    UploadSimpleImgComponent,
    ReactiveFormsModule,
    BsDatepickerModule,
    TinymceComponent,
    RouterLink
  ],
  templateUrl: './update-page.component.html',
  styleUrl: './update-page.component.css',
})
export class UpdatePageComponent {
  @ViewChild(UploadSimpleImgComponent)
  UploadSimpleImg!: UploadSimpleImgComponent;

  private PageService = inject(PageService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

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
  public pageId!: number; // ID del page a actualizar
  public imgCurrent!: number; // ID del page a actualizar

  form: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    content: new FormControl(''),
  });

  ngOnInit(): void {
    // Obtener el ID del page desde la URL
    this.pageId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPageData();
  }

  private loadPageData(): void {
    this.loading = true;
    this.PageService.getPageById(this.pageId).subscribe({
      next: (page) => {
        this.imgCurrent = page.image;
        this.form.patchValue({
          title: page.title,
          status: page.status,
          content: page.content,
        });
      },
      error: (error) => {
        this.errorMessage = 'No se pudieron cargar los datos del page.';
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
    // Verificar si el formulario es válido antes de enviarlo
    if (this.form.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos requeridos.';
      this.loading = false;
      window.scroll(0, 0);
      return;
    }

    const formData = new FormData();
    formData.append('_method', 'PUT');
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

    this.PageService.updatePage(this.pageId, formData)
      .subscribe({
        next: (success: string) => {
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
