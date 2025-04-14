/** Componente para crear una nueva página */
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

import { PageService } from '@services/page.service';
import { ToastService } from '@services/toast.service';
import { UploadSimpleImgComponent } from '@shared/upload-simple-img/upload-simple-img.component';
import { TinymceComponent } from '@shared/tinymce/tinymce.component';

// Interfaz para errores HTTP esperados
interface HttpValidationError {
  status: number;
  error: {
    errors: { [key: string]: string[] };
  };
}

@Component({
  selector: 'app-store-page',
  imports: [UploadSimpleImgComponent, ReactiveFormsModule, TinymceComponent],
  templateUrl: './store-page.component.html',
  styleUrl: './store-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorePageComponent {
  // Referencias a componentes
  public uploadSimpleImg =
    viewChild.required<UploadSimpleImgComponent>('uploadSimpleImgRef');

  // Servicios inyectados
  private readonly pageService = inject(PageService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly scroller = inject(ViewportScroller);

  // Estado de carga y mensajes de error
  public loading = signal(false);
  public errorMessage = signal<string[]>([]);

  // Configuración del editor
  public readonly editorOptions = {
    height: 500,
    menubar: true,
  };

  // Formulario reactivo para la página (usando signals)
  public form = this.fb.nonNullable.group({
    title: this.fb.nonNullable.control('', Validators.required),
    status: this.fb.nonNullable.control('', Validators.required),
    content: this.fb.nonNullable.control(''),
  });

  /** Envía el formulario si es válido */
  public onSubmit(): void {
    if (!this.validateForm()) return;

    this.loading.set(true);
    this.clearMessages();

    const formData = this.buildFormData();

    this.pageService
      .storePage(formData)
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
    formData.append('status', controls.status.value);
    formData.append('content', controls.content.value);

    const image = this.uploadSimpleImg().getFile();
    if (image) {
      formData.append('image', image);
    }

    return formData;
  }

  // Maneja una respuesta exitosa del backend
  private handleSuccess(success: string): void {
    this.toastService.success(success);
    this.router.navigate(['/admin/pages']);
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
}
