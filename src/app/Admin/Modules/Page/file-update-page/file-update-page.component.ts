import { Component, inject, signal } from '@angular/core';
import { FileService } from '../../../../services/file.service';
import { ToastService } from '../../../../services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
import { take, tap } from 'rxjs';
import { File } from '../../../../interfaces/File';

@Component({
  selector: 'app-file-update-page',
  imports: [ReactiveFormsModule],
  templateUrl: './file-update-page.component.html',
  styleUrl: './file-update-page.component.css',
})
export class FileUpdatePageComponent {
  //Inyección de servicios usando la nueva API de Angular.
  private fileService = inject(FileService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  // Variables de estado reactivas
  public loading = signal(false);
  public errorMessage = signal<string>('');
  public fileId = signal<number>(
    Number(this.route.snapshot.paramMap.get('idfile')),
  );
  public pageId = signal<number>(
    Number(this.route.snapshot.paramMap.get('idpage')),
  );

  // Definición del formulario con validaciones
  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: '',
  });

  //Cargando datos de objeto
  fileRs = rxResource<File, void>({
    loader: () =>
      this.fileService
        .getFileById(this.fileId())
        .pipe(tap((response) => this.setData(response))),
  });

  //Maneja el envío del formulario.
  //Valida el formulario, construye los datos y los envía al backend.
  onSubmit(): void {
    if (!this.validateForm()) return;
    this.loading.set(true);
    this.clearMessages();

    const formData = this.buildFormData();

    this.fileService
      .updateFile(this.fileId(), formData)
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

  private setData(response: File) {
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

  // Construye los datos a enviar en `FormData`
  private buildFormData(): FormData {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('name', this.form.value.name!);
    formData.append('description', this.form.value.description!);

    return formData;
  }

  // Maneja la respuesta exitosa del backend
  private handleSuccess(success: string): void {
    this.resetForm();
    this.toastService.success(success);
    this.router.navigate(['/admin/pages/files', this.pageId()]);
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
  }

  // Procesa los errores de validación del backend
  private processErrors(errors: { [key: string]: string[] }): string {
    const errorList = Object.keys(errors)
      .flatMap((key) => errors[key])
      .map((error) => `${error}</br>`)
      .join('');
    return `${errorList}`;
  }
}
