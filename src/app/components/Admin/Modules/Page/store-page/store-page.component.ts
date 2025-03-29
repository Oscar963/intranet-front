import { Component, inject, signal, ViewChild } from '@angular/core';
import { UploadSimpleImgComponent } from '@shared/upload-simple-img/upload-simple-img.component';
import { TinymceComponent } from '@shared/tinymce/tinymce.component';
import { Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { PageService } from '@services/page.service';
import { Router } from '@angular/router';
import { ToastService } from '@services/toast.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-store-page',
  imports: [UploadSimpleImgComponent, ReactiveFormsModule, TinymceComponent],
  templateUrl: './store-page.component.html',
  styleUrl: './store-page.component.css',
})
export class StorePageComponent {
  // Referencia al componente de subida de imágenes.
  // Se usa para obtener la imagen seleccionada.
  @ViewChild(UploadSimpleImgComponent)
  UploadSimpleImg!: UploadSimpleImgComponent;

  //Inyección de servicios usando la nueva API de Angular.
  private pageService = inject(PageService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  public textContent: string = ''; // Contenido inicial
  public customOptions = {
    height: 500, // Altura personalizada
    menubar: true, // Mostrar la barra de menús
  };

  // Variables de estado reactivas
  public loading = signal(false);
  public errorMessage = signal<string>('');

  // Definición del formulario con validaciones
  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    status: ['', Validators.required],
    content: '',
  });

  //Maneja el envío del formulario.
  //Valida el formulario, construye los datos y los envía al backend.
  onSubmit(): void {
    if (!this.validateForm()) return;
    this.loading.set(true);
    this.clearMessages();

    const formData = this.buildFormData();

    this.pageService
      .storePage(formData)
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
    formData.append('status', this.form.value.status!);
    formData.append('content', this.form.value.content!);

    // Agregar la imagen si está disponible
    const image = this.UploadSimpleImg.getFile();
    if (image) formData.append('image', image);

    return formData;
  }

  // Maneja la respuesta exitosa del backend
  private handleSuccess(success: string): void {
    this.resetForm();
    this.toastService.success(success);
    this.router.navigate(['/admin/pages']);
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

  // onSubmit(): void {
  //   this.loading = true;
  //   this.errorMessage = '';
  //   this.successMessage = '';

  //   this.form.markAllAsTouched();
  //   // Verificar si el formulario es válido antes de enviarlo
  //   if (this.form.invalid) {
  //     this.errorMessage = 'Por favor, complete todos los campos requeridos.';
  //     this.loading = false;
  //     window.scroll(0, 0);
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('title', this.form.value.title);
  //   formData.append('status', this.form.value.status);
  //   formData.append('content', this.form.value.content);

  //   // Obtener el archivo desde Dropzone
  //   const image = this.UploadSimpleImg.getFile();
  //   if (image) {
  //     formData.append('image', image);
  //   } else {
  //     //   console.error('No hay image seleccionada');
  //   }

  //   this.pageService
  //     .storePage(formData)
  //     .subscribe({
  //       next: (success: string) => {
  //         this.form.reset();
  //         this.UploadSimpleImg.removeAllFiles();
  //         this.notificationService.showSuccess(success); // Mostrar mensaje de éxito
  //         this.router.navigate(['/admin/pages']);
  //       },
  //       error: (error) => {
  //         if (error.status === 422) {
  //           this.errorMessage = this.processErrors(error.error.errors);
  //           window.scroll(0, 0);
  //         } else {
  //           this.errorMessage = error;
  //         }
  //       },
  //     })
  //     .add(() => {
  //       this.loading = false;
  //     });
  // }
}
