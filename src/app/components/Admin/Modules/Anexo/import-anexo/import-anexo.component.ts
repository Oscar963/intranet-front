import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
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
  // Inyección de dependencias
  private readonly anexoService = inject(AnexoService);
  private readonly toastService = inject(ToastService);

  // Estados reactivos
  public readonly isUploading = signal<boolean>(false);
  public readonly uploadProgress = signal<number>(0);
  public readonly selectedFile = signal<File | null>(null);
  public readonly loading = signal<boolean>(false);
  public readonly errorMessage = signal<string>('');

  // Tipos de archivo permitidos
  private readonly validFileTypes = [
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  /**
   * Maneja la selección de archivos con validación de tipo
   * @param event Evento de cambio del input file
   */
  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      this.toastService.error('No se seleccionó ningún archivo');
      return;
    }

    const file = input.files[0];
    const fileType = file.type?.toLowerCase();

    if (this.validFileTypes.includes(fileType)) {
      this.selectedFile.set(file);
      this.resetMessages();
      this.toastService.info('Archivo seleccionado correctamente');
    } else {
      this.toastService.error(
        'Formato no válido. Use archivos Excel (.xlsx) o CSV (.csv)',
      );
      this.selectedFile.set(null);
    }
  }

  /**
   * Confirma y ejecuta la importación de datos
   */
  public onSubmit(): void {
    if (!this.selectedFile()) {
      this.toastService.error('Seleccione un archivo antes de continuar');
      return;
    }

    this.showConfirmationDialog();
  }

  /**
   * Exporta los anexos a un archivo Excel
   */
  public exportAnexos(): void {
    this.loading.set(true);

    this.anexoService.exportAnexos().subscribe({
      next: (data: Blob) => {
        saveAs(data, `anexos_${new Date().toISOString().slice(0, 10)}.xlsx`);
        this.toastService.success('Exportación completada con éxito');
      },
      error: (error) => this.handleExportError(error),
      complete: () => this.loading.set(false),
    });
  }

  // -------------------- Métodos privados -------------------- //

  /**
   * Muestra el diálogo de confirmación para la importación
   */
  private showConfirmationDialog(): void {
    Swal.fire({
      title: 'Confirmar Importación',
      text: 'Esta acción reemplazará todos los anexos existentes. ¿Desea continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, importar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.uploadFile();
      }
    });
  }

  /**
   * Sube el archivo seleccionado al servidor
   */
  private uploadFile(): void {
    const file = this.selectedFile();
    if (!file) return;

    this.prepareUpload();
    this.showLoadingAlert();

    this.anexoService.uploadAnexos(file).subscribe({
      next: (event) => this.handleUploadProgress(event),
      error: (error) => this.handleUploadError(error),
      complete: () => this.completeUpload(),
    });
  }

  /**
   * Maneja el progreso de la subida
   * @param event Evento HTTP de progreso
   */
  private handleUploadProgress(event: HttpEvent<any>): void {
    if (event.type === HttpEventType.UploadProgress && event.total) {
      const progress = Math.round((100 * event.loaded) / event.total);
      this.uploadProgress.set(progress);
    } else if (event.type === HttpEventType.Response && event.body?.message) {
      this.toastService.success(event.body.message);
      this.resetFileSelection();
      Swal.close();
    }
  }

  /**
   * Maneja errores durante la exportación
   * @param error Error recibido
   */
  private handleExportError(error: any): void {
    const message = error?.error?.message ?? 'Error al exportar los datos';
    this.toastService.error(message);
    this.loading.set(false);
  }

  /**
   * Maneja errores durante la subida
   * @param error Error recibido
   */
  private handleUploadError(error: any): void {
    this.errorMessage.set(
      error?.message ?? 'Error desconocido durante la importación',
    );
    this.toastService.error(this.errorMessage());
    this.resetUploadState();
    Swal.close();
  }

  /**
   * Prepara el estado para una nueva subida
   */
  private prepareUpload(): void {
    this.isUploading.set(true);
    this.loading.set(true);
    this.uploadProgress.set(0);
    this.errorMessage.set('');
  }

  /**
   * Completa el proceso de subida
   */
  private completeUpload(): void {
    this.isUploading.set(false);
    this.loading.set(false);
  }

  /**
   * Muestra alerta de carga durante la subida
   */
  private showLoadingAlert(): void {
    Swal.fire({
      title: 'Procesando archivo',
      html: `Progreso: <b>${this.uploadProgress()}%</b>`,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
  }

  /**
   * Resetea la selección de archivo
   */
  private resetFileSelection(): void {
    this.selectedFile.set(null);
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  /**
   * Resetea el estado de la subida
   */
  private resetUploadState(): void {
    this.isUploading.set(false);
    this.loading.set(false);
    this.uploadProgress.set(0);
  }

  /**
   * Resetea todos los mensajes y estados
   */
  private resetMessages(): void {
    this.errorMessage.set('');
    this.loading.set(false);
    this.uploadProgress.set(0);
  }
}
