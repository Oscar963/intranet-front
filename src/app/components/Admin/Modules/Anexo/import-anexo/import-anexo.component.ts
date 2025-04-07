import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { AnexoService } from '@services/anexo.service';
import { ToastService } from '@app/core/services/toast.service';

@Component({
  selector: 'app-import-anexo',
  templateUrl: './import-anexo.component.html',
  styleUrls: ['./import-anexo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportAnexoComponent {
  // === SERVICIOS INYECTADOS === //
  private readonly anexoService = inject(AnexoService);
  private readonly toastService = inject(ToastService);

  // === SEÑALES REACTIVAS === //
  readonly isUploading = signal(false);
  readonly uploadProgress = signal(0);
  readonly selectedFile = signal<File | null>(null);
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  // === ELEMENTOS DEL DOM === //
  public fileInput =
    viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  // === CONSTANTES === //
  private readonly validFileTypes = [
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel
  ];

  // === MÉTODOS PÚBLICOS === //

  /**
   * Valida y asigna el archivo seleccionado.
   * @param event - Evento del input file
   */
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      this.toastService.error('No se seleccionó ningún archivo');
      return;
    }

    if (!this.validFileTypes.includes(file.type.toLowerCase())) {
      this.toastService.error('Formato no válido. Use archivos Excel o CSV');
      this.selectedFile.set(null);
      return;
    }

    this.selectedFile.set(file);
    this.resetMessages();
    this.toastService.info('Archivo seleccionado correctamente');
  }

  /**
   * Valida y confirma la importación del archivo seleccionado.
   */
  onSubmit(): void {
    if (!this.selectedFile()) {
      this.toastService.error('Seleccione un archivo antes de continuar');
      return;
    }

    this.confirmImport(); // Muestra confirmación antes de subir
  }

  /**
   * Exporta los anexos como un archivo Excel.
   * Usa `file-saver` para descargar el blob recibido.
   */
  exportAnexos(): void {
    this.loading.set(true);

    this.anexoService.exportAnexos().subscribe({
      next: (blob: Blob) => {
        const fileName = `anexos_${new Date().toISOString().slice(0, 10)}.xlsx`;
        saveAs(blob, fileName);
        this.toastService.success('Exportación completada con éxito');
      },
      error: (err) => {
        const message = err?.error?.message ?? 'Error al exportar los datos';
        this.toastService.error(message);
      },
      complete: () => this.loading.set(false),
    });
  }

  // === MÉTODOS PRIVADOS (LÓGICA INTERNA) === //

  /**
   * Muestra un diálogo de confirmación antes de importar.
   */
  private confirmImport(): void {
    Swal.fire({
      title: 'Confirmar Importación',
      text: 'Esta acción reemplazará todos los anexos existentes. ¿Desea continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, importar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) this.uploadFile();
    });
  }

  /**
   * Sube el archivo al servidor y maneja el progreso.
   */
  private uploadFile(): void {
    const file = this.selectedFile();
    if (!file) return;

    this.prepareUpload();
    this.showProgressAlert();

    this.anexoService.uploadAnexos(file).subscribe({
      next: (event) => this.trackUploadProgress(event),
      error: (error) => this.handleUploadError(error),
      complete: () => this.completeUpload(),
    });
  }

  /**
   * Actualiza el progreso de la subida y maneja la respuesta final.
   * @param event - Evento HTTP (UploadProgress o Response)
   */
  private trackUploadProgress(event: HttpEvent<any>): void {
    if (event.type === HttpEventType.UploadProgress && event.total) {
      const percent = Math.round((100 * event.loaded) / event.total);
      this.uploadProgress.set(percent);
    }

    if (event.type === HttpEventType.Response) {
      const msg = event.body?.message ?? 'Importación completada';
      this.toastService.success(msg);
      this.clearFileInput();
      Swal.close();
    }
  }

  /**
   * Maneja errores durante la subida.
   * @param error - Error HTTP
   */
  private handleUploadError(error: any): void {
    const message =
      error?.message ?? 'Error desconocido durante la importación';
    this.errorMessage.set(message);
    this.toastService.error(message);
    this.resetUploadState();
    Swal.close();
  }

  // === HELPERS (FUNCIONES DE UTILIDAD) === //

  private prepareUpload(): void {
    this.isUploading.set(true);
    this.loading.set(true);
    this.uploadProgress.set(0);
    this.errorMessage.set('');
  }

  private resetUploadState(): void {
    this.isUploading.set(false);
    this.loading.set(false);
    this.uploadProgress.set(0);
  }

  private resetMessages(): void {
    this.errorMessage.set('');
    this.uploadProgress.set(0);
  }

  private clearFileInput(): void {
    this.selectedFile.set(null);

    if (this.fileInput()?.nativeElement) {
      this.fileInput().nativeElement.value = '';
    }
  }

  private showProgressAlert(): void {
    Swal.fire({
      title: 'Procesando archivo',
      html: `Progreso: <b>${this.uploadProgress()}%</b>`,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
  }

  private completeUpload(): void {
    this.isUploading.set(false);
    this.loading.set(false);
  }
}
