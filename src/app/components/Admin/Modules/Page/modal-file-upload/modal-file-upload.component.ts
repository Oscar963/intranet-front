import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  signal,
  viewChild,
  inject,
  input,
} from '@angular/core';
import { Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { Modal } from 'bootstrap';

import { ToastService } from '@services/toast.service';
import { PageService } from '@app/core/services/page.service';
import { UploadSimpleFileComponent } from '@shared/upload-simple-file/upload-simple-file.component';

/**
 * Componente modal para subir archivos a una página.
 * Permite la selección de archivos y el envío de metadatos asociados.
 */
@Component({
  selector: 'app-modal-file-upload',
  imports: [UploadSimpleFileComponent, ReactiveFormsModule],
  templateUrl: './modal-file-upload.component.html',
  styleUrls: ['./modal-file-upload.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalFileUploadComponent {
  // Servicios
  private readonly pageService = inject(PageService);
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

  // Formulario
  public form = this.fb.nonNullable.group({
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
   * Maneja el envío del formulario de subida de archivo.
   * Valida los datos, construye el FormData y envía la solicitud al servidor.
   */
  public onSubmit(): void {
    if (!this.validateForm()) return;
    this.loading.set(true);
    this.clearMessages();

    const formData = this.buildFormData();

    this.pageService
      .storeFiles(formData)
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
   * Abre el modal y reinicia el estado del formulario.
   */
  public openModal(): void {
    this.errorMessage.set('');
    this.resetForm();
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
    formData.append('name', this.form.value.name!);
    formData.append('description', this.form.value.description!);
    formData.append('page_id', this.pageId()?.toString()!);

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
