import { FileService } from '@services/file.service';
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
import { Modal } from 'bootstrap';
import { UploadSimpleFileComponent } from '@shared/upload-simple-file/upload-simple-file.component';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-modal-file-upload',
  imports: [UploadSimpleFileComponent, ReactiveFormsModule],
  templateUrl: './modal-file-upload.component.html',
  styleUrls: ['./modal-file-upload.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalFileUploadComponent {
  private fileService = inject(FileService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  public modal = signal<Modal | null>(null); // Signal para almacenar la instancia del modal de Bootstrap
  public modalElementRef = viewChild.required<ElementRef>('modalRef'); // Capturamos la referencia al elemento del modal en el template
  public uploadSimpleFile =
    viewChild.required<UploadSimpleFileComponent>('uploadSimpleRef'); // Capturamos la referencia del componente  UploadSimpleFileComponent

  public loading = signal<Boolean>(false);
  public errorMessage = signal<string>('');
  public pageId = input<number>();

  // Definición del formulario con validaciones
  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
  });

  ngAfterViewInit(): void {
    // Inicializa el modal después de que la vista esté completamente inicializada
    this.setModal();
  }

  onSubmit(): void {
    //Valida el formulario, construye los datos y los envía al backend.
    if (!this.validateForm()) return;
    this.loading.set(true);
    this.clearMessages();

    const formData = this.buildFormData();

    this.fileService
      .storeFiles(formData)
      .pipe(take(1))
      .subscribe({
        next: (success: string) => this.handleSuccess(success),
        error: (error) => {
          this.handleError(error);
          this.loading.set(false);
        },
        complete: () => {
          this.loading.set(false);
          this.closeModal();
        },
      });
  }

  private clearMessages(): void {
    // Limpia los mensajes de error y éxito
    this.errorMessage.set('');
  }

  private buildFormData(): FormData {
    // Construye los datos a enviar en `FormData`
    const formData = new FormData();
    formData.append('name', this.form.value.name!);
    formData.append('description', this.form.value.description!);
    formData.append('page_id', this.pageId()?.toString()!);

    // Obtener el archivo desde Dropzone
    const file = this.uploadSimpleFile().getFile();
    if (file) {
      formData.append('file', file);
    }
    return formData;
  }

  private handleSuccess(success: string): void {
    // Maneja la respuesta exitosa del backend
    this.resetForm();
    this.toastService.success(success);
    this.router.navigate(['admin/pages/files', this.pageId()]);
  }

  private validateForm(): boolean {
    // Valida el formulario antes de enviarlo
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.errorMessage.set('Por favor, complete todos los campos requeridos.');
      window.scroll(0, 0);
      return false;
    }
    return true;
  }

  private handleError(error: any): void {
    // Maneja los errores del backend
    if (error.status === 422) {
      this.errorMessage.set(this.processErrors(error.error.errors));
      window.scroll(0, 0);
    } else {
      this.errorMessage.set(error);
    }
  }

  private resetForm(): void {
    // Reinicia el formulario y limpia los archivos
    this.form.reset();
    this.uploadSimpleFile().removeAllFiles();
  }

  private processErrors(errors: { [key: string]: string[] }): string {
    // Procesa los errores de validación del backend
    const errorList = Object.keys(errors)
      .flatMap((key) => errors[key])
      .map((error) => `${error}</br>`)
      .join('');
    return `${errorList}`;
  }

  setModal() {
    // Guarda la instancia en el signal
    this.modal.set(new Modal(this.modalElementRef().nativeElement));
  }

  openModal() {
    this.errorMessage.set('');
    this.resetForm();
    this.modal()?.show();
  }

  closeModal() {
    this.modal()?.hide();
  }
}
