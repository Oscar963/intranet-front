import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { Modal } from 'bootstrap';

import { FileService } from '@app/core/services/file.service';
import { ToastService } from '@app/core/services/toast.service';
import { UploadSimpleFileComponent } from '@shared/upload-simple-file/upload-simple-file.component';

/**
 * Componente modal para actualizar archivos existentes.
 * Permite modificar los metadatos y el contenido del archivo.
 */
@Component({
  selector: 'app-modal-update-file-upload',
  imports: [UploadSimpleFileComponent, ReactiveFormsModule],
  templateUrl: './modal-update-file-upload.component.html',
  styleUrl: './modal-update-file-upload.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalUpdateFileUploadComponent {
  // Servicios
  private readonly fileService = inject(FileService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  // Referencias
  public modal = signal<Modal | null>(null);
  public modalElementRef = viewChild.required<ElementRef>('modalRef');
  public uploadSimpleFile =
    viewChild.required<UploadSimpleFileComponent>('uploadSimpleRef');

  // Estado
  public loading = signal<boolean>(false);
  public errorMessage = signal<string>('');
  public pageId = input<number>();
  public fileId = signal<number>(0);

  // Formulario
  public form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
  });

  /**
   * Inicializa el modal después de que la vista esté completamente inicializada.
   */
  public ngAfterViewInit(): void {
    this.setModal();
  }

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
        complete: () => {
          this.loading.set(false);
          this.closeModal();
        },
      });
  }

  /**
   * Abre el modal y carga los datos del archivo a editar.
   * @param file - Datos del archivo a editar
   */
  public openModal(file: any): void {
    this.errorMessage.set('');
    this.resetForm();
    this.fileId.set(file.id);
    this.form.patchValue({
      name: file.name,
      description: file.description,
    });
    this.modal()?.show();
  }

  /**
   * Cierra el modal.
   */
  public closeModal(): void {
    this.modal()?.hide();
  }

  // Métodos privados
  private setModal(): void {
    this.modal.set(new Modal(this.modalElementRef().nativeElement));
  }

  private clearMessages(): void {
    this.errorMessage.set('');
  }

  private buildFormData(): FormData {
    const formData = new FormData();
    formData.append('_method', 'PUT'); // Laravel necesita esto si usas POST para update
    formData.append('name', this.form.value.name!);
    formData.append('description', this.form.value.description!);
    formData.append('page_id', this.pageId()?.toString() ?? '');

    const file = this.uploadSimpleFile().getFile();
    if (file) {
      formData.append('file', file);
    }
    return formData;
  }

  private handleSuccess(success: string): void {
    this.resetForm();
    this.toastService.success(success);
    this.router.navigate(['admin/pages/files', this.pageId()]);
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
    this.uploadSimpleFile().removeAllFiles();
  }

  private processErrors(errors: { [key: string]: string[] }): string {
    const errorList = Object.keys(errors)
      .flatMap((key) => errors[key])
      .map((error) => `${error}</br>`)
      .join('');
    return `${errorList}`;
  }
}
