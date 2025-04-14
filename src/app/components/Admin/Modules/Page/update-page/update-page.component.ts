/** Componente para actualizar una página */
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { take, finalize, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

import { PageService } from '@services/page.service';
import { ToastService } from '@services/toast.service';
import { Page } from '@interfaces/Page';
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
  selector: 'app-update-page',
  imports: [
    UploadSimpleImgComponent,
    ReactiveFormsModule,
    TinymceComponent,
    RouterLink,
  ],
  templateUrl: './update-page.component.html',
  styleUrl: './update-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePageComponent {
  // Servicios inyectados
  private readonly pageService = inject(PageService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly scroller = inject(ViewportScroller);

  // Referencia al componente de carga de imágenes
  public uploadSimpleFileImg =
    viewChild.required<UploadSimpleImgComponent>('uploadSimpleImgRef');

  // Estado de carga y errores
  public loading = signal(false);
  public errorMessage = signal<string[]>([]);

  // ID de la página desde la URL
  public readonly pageId = signal<number>(
    Number(this.route.snapshot.paramMap.get('id')),
  );

  // Estado local de la página cargada
  public pageResource = signal<Page | null>(null);

  // Recurso reactivo usando rxResource
  public readonly pageLoader = rxResource<Page, void>({
    loader: () =>
      this.pageService
        .getPageById(this.pageId())
        .pipe(tap((response) => this.setData(response))),
  });

  // Formulario reactivo
  public form = this.fb.nonNullable.group({
    title: this.fb.nonNullable.control('', Validators.required),
    status: this.fb.nonNullable.control('', Validators.required),
    content: this.fb.nonNullable.control(''),
  });

  /** Guarda los datos en el signal y rellena el formulario */
  private setData(page: Page): void {
    this.pageResource.set(page);

    this.form.patchValue({
      title: page.title,
      status: page.status,
      content: page.content || '',
    });
  }

  /** Envía el formulario si es válido */
  public onSubmit(): void {
    if (!this.validateForm()) return;

    this.loading.set(true);
    this.clearMessages();

    const formData = this.buildFormData();

    this.pageService
      .updatePage(this.pageId(), formData)
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
    formData.append('status', controls.status.value);
    formData.append('content', controls.content.value);

    const image = this.uploadSimpleFileImg().getFile();
    if (image) {
      formData.append('image', image);
    }

    return formData;
  }

  // Maneja una respuesta exitosa del backend
  private handleSuccess(success: string): void {
    this.toastService.success(success);
    this.router.navigate(['/admin/pages']);
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
