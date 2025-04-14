/** Componente para actualizar un archivo */
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { take, finalize, tap } from 'rxjs';

import { FileService } from '@services/file.service';
import { ToastService } from '@services/toast.service';
import { File } from '@interfaces/File';
import { rxResource } from '@angular/core/rxjs-interop';

// Interfaz para errores HTTP esperados
interface HttpValidationError {
  status: number;
  error: {
    errors: { [key: string]: string[] };
  };
}

@Component({
  selector: 'app-update-file',
  imports: [ReactiveFormsModule],
  templateUrl: './update-file.component.html',
  styleUrl: './update-file.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateFileComponent {
  // Servicios inyectados
  private readonly fileService = inject(FileService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly scroller = inject(ViewportScroller);

  // Estado de carga y errores
  public loading = signal(false);
  public errorMessage = signal<string[]>([]);

  // ID del archivo desde la URL
  public readonly fileId = signal<number>(
    Number(this.route.snapshot.paramMap.get('id')),
  );

  // Estado local del archivo cargado
  public fileResource = signal<File | null>(null);

  // Recurso reactivo usando rxResource
  public fileLoader = rxResource<File, void>({
    loader: () =>
      this.fileService
        .getFileById(this.fileId())
        .pipe(tap((response) => this.setData(response))),
  });

  // Formulario reactivo
  public form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', Validators.required),
    description: this.fb.nonNullable.control(''),
  });

  /** Guarda los datos en el signal y rellena el formulario */
  private setData(file: File): void {
    this.fileResource.set(file);

    this.form.patchValue({
      name: file.name,
      description: file.description || '',
    });
  }

  /** Envía el formulario si es válido */
  public onSubmit(): void {
    if (!this.validateForm()) return;

    this.loading.set(true);
    this.clearMessages();

    const formData = this.buildFormData();

    this.fileService
      .updateFile(this.fileId(), formData)
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
    formData.append('name', controls.name.value);
    formData.append('description', controls.description.value);

    return formData;
  }

  // Maneja una respuesta exitosa del backend
  private handleSuccess(success: string): void {
    this.toastService.success(success);
    this.router.navigate(['/admin/files']);
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
