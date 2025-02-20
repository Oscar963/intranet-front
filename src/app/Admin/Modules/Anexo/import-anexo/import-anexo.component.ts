import { Component, inject } from '@angular/core';
import { AnexoService } from '../../../../core/services/anexo.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import Swal from 'sweetalert2';
import { NotificationService } from '../../../../core/services/notification.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-import-anexo',
  imports: [],
  templateUrl: './import-anexo.component.html',
  styleUrl: './import-anexo.component.css',
})
export class ImportAnexoComponent {
  private anexoService = inject(AnexoService);
  private notificationService = inject(NotificationService);

  selectedFile?: File;
  uploadProgress = 0;
  isUploading = false;

  loading = false;
  errorMessage = '';
  successMessage = '';

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (
        file.type === 'text/csv' ||
        file.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        this.selectedFile = file;
        this.resetMessages();
      } else {
        this.notificationService.showError(
          'Seleccione un archivo válido (Excel o CSV).'
        );
        this.selectedFile = undefined;
      }
    }
  }

  resetMessages(): void {
    this.loading = false;
    this.uploadProgress = 0;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmit(): void {
    if (!this.selectedFile) {
      this.notificationService.showError(
        'Debe seleccionar un archivo antes de enviar.'
      );
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'La importación de datos eliminará todos los anexos actuales.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.uploadFile();
      }
    });
  }

  private uploadFile(): void {
    this.loading = true;
    this.uploadProgress = 0;
    Swal.fire({
      title: 'Importando...',
      html: 'Por favor, espera mientras se suben los registros.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.anexoService.uploadAnexos(this.selectedFile!).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        } else if (
          event.type === HttpEventType.Response &&
          event.body?.message
        ) {
          this.successMessage = event.body.message;
          this.notificationService.showSuccess(event.body.message);
          Swal.close();
          this.selectedFile = undefined;
        }
      },
      error: (error) => {
        this.loading = false;
        this.uploadProgress = 0;
        this.errorMessage = error || 'Error al importar los datos.';
        this.notificationService.showError(this.errorMessage);
        Swal.close();
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  exportAnexos(): void {
    this.loading = true;
    this.anexoService.exportAnexos().subscribe({
      next: (data: Blob) => {
        saveAs(data, 'anexos.xlsx'); // Aquí usamos FileSaver.js
        this.notificationService.showSuccess('Datos exportados correctamente.');
      },
      error: (error) => {
        this.notificationService.showError(
          error?.error?.message || 'Error al exportar los datos.'
        );
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
