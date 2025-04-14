import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
import { take, tap } from 'rxjs';

import { FileService } from '@services/file.service';
import { ToastService } from '@services/toast.service';
import { File } from '@interfaces/File';

/**
 * Componente para actualizar la información de un archivo existente.
 * Permite modificar el nombre y la descripción del archivo.
 */
@Component({
  selector: 'app-file-update-page',
  imports: [ReactiveFormsModule],
  templateUrl: './file-update-page.component.html',
  styleUrl: './file-update-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUpdatePageComponent {
  // Servicios
  private readonly fileService = inject(FileService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  // Estado
  public loading = signal(false);
  public errorMessage = signal<string>('');
  public fileId = signal<number>(
    Number(this.route.snapshot.paramMap.get('idfile')),
  );
  public readonly pageId = signal<number>(
    Number(this.route.snapshot.paramMap.get('idpage')),
  );

  // Formulario
  public form = this.fb.group({
    name: ['', Validators.required],
    description: '',
  });

  /**
   * Recurso reactivo para cargar los datos del archivo.
   * Actualiza automáticamente el formulario con los datos del archivo.
   */
  public fileRs = rxResource<File, void>({
    loader: () =>
      this.fileService
        .getFileById(this.fileId())
        .pipe(tap((response) => this.setData(response))),
  });

  /**
   * Maneja el envío del formulario de actualización.
   * Valida los datos, construye el FormData y envía la solicitud al servidor.
   */
  public onSubmit(): void {
    if (!this.validateForm()) return;
    this.loading.set(true);
    this.clearMessages();

    const formData = this.buildFormData();

    this.fileService
      .updateFile(this.fileId(), formData)
      .pipe(take(1))
      .subscribe({
        next: (success) => this.handleSuccess(success),
        error: (error) => this.handleError(error),
        complete: () => this.loading.set(false),
      });
  }

  // Métodos privados
  private setData(response: File): void {
    if (response) {
      this.form.patchValue({
        name: response.name,
        description: response.description || '',
      });
    }
  }

  private clearMessages(): void {
    this.errorMessage.set('');
  }

  private buildFormData(): FormData {
    const formData = new FormData();
    formData.append('_method', 'PUT'); // Laravel necesita esto si usas POST para update
    formData.append('name', this.form.value.name!);
    formData.append('description', this.form.value.description!);
    return formData;
  }

  private handleSuccess(success: string): void {
    this.resetForm();
    this.toastService.success(success);
    this.router.navigate(['/admin/pages/files', this.pageId()]);
  }

  private validateForm(): boolean {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.errorMessage.set('Por favor, complete todos los campos requeridos.');
      window.scroll(0, 0);
      return false;
    }
    return true;
  }

  private handleError(error: any): void {
    if (error.status === 422) {
      this.errorMessage.set(this.processErrors(error.error.errors));
      window.scroll(0, 0);
    } else {
      this.errorMessage.set(error);
    }
  }

  private resetForm(): void {
    this.form.reset();
  }

  private processErrors(errors: { [key: string]: string[] }): string {
    const errorList = Object.keys(errors)
      .flatMap((key) => errors[key])
      .map((error) => `${error}</br>`)
      .join('');
    return `${errorList}`;
  }
}
