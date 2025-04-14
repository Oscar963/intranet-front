/** Componente principal para listar y gestionar archivos */
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, take } from 'rxjs';
import Swal from 'sweetalert2';

import { FileService } from '@services/file.service';
import { File } from '@interfaces/File';
import { ToastService } from '@services/toast.service';
import { PaginationService } from '@services/pagination.service';
import { PaginationMeta } from '@interfaces/Pagination';

@Component({
  selector: 'app-index-file',
  imports: [RouterLink],
  templateUrl: './index-file.component.html',
  styleUrls: ['./index-file.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexFileComponent {
  // Servicios inyectados
  private readonly fileService = inject(FileService);
  private readonly toastService = inject(ToastService);
  private readonly paginationService = inject(PaginationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Estado de búsqueda, paginación y metadatos
  public query = signal<string>('');
  public show = signal<number>(15);
  public page = signal<number>(1);
  public meta = signal<PaginationMeta>(this.paginationService.defaultMeta());

  // Opciones para cantidad de ítems por página
  public readonly itemsPerPageOptions = [
    { value: 15, label: '15' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
    { value: 500, label: '500' },
  ];

  // Recurso reactivo para obtener datos de archivos desde el backend
  public readonly filesResource = rxResource<
    File[],
    { query: string; page: number; show: number }
  >({
    request: () => ({
      query: this.query(),
      page: this.page(),
      show: this.show(),
    }),
    loader: ({ request }) => this.loadFilesData(request),
  });

  constructor() {
    this.syncPageFromRoute(); // Inicializa el número de página desde la URL
    this.setupQueryWatcher(); // Reinicia la página al cambiar la búsqueda
  }

  /** Elimina un archivo con confirmación previa */
  public deleteItem(id: number): void {
    this.confirmDelete().then((result) => {
      if (result.isConfirmed) {
        this.executeDelete(id);
      }
    });
  }

  /** Navega a la página indicada si es válida */
  public goToPage(page: number | null): void {
    if (this.paginationService.isValidPage(page, this.meta().last_page)) {
      this.router.navigate(['admin/files/page', page]);
    }
  }

  /** Descarga un archivo del servidor */
  public downloadFile(fileId: number, fileName: string): void {
    this.showLoading('Descargando archivo...');
    this.fileService.downloadFile(fileId).subscribe({
      next: (response) => this.handleDownloadSuccess(response, fileName),
      error: (error) => this.handleError('Error al descargar', error),
    });
  }

  /** Copia texto al portapapeles */
  public copyToClipboard(text: string): void {
    navigator.clipboard
      .writeText(text)
      .then(() => this.toastService.info('URL copiada al portapapeles'))
      .catch((err) => this.toastService.error('Error al copiar', err));
  }

  /** Obtiene el icono correspondiente al tipo de archivo */
  public getFileIcon(fileType: string): string {
    const iconMap: Record<string, string> = {
      PDF: '/assets/icons/files/pdf.png',
      Word: '/assets/icons/files/doc.png',
      Excel: '/assets/icons/files/xls.png',
      PowerPoint: '/assets/icons/files/ppt.png',
      'Video MP4': '/assets/icons/files/mp4.png',
      'Imagen JPEG': '/assets/icons/files/jpg-file.png',
      'Imagen JPG': '/assets/icons/files/jpg-file.png',
      'Imagen PNG': '/assets/icons/files/png.png',
      'Imagen GIF': '/assets/icons/files/gif.png',
      'Archivo ZIP': '/assets/icons/files/zip.png',
    };
    return iconMap[fileType] || '/assets/icons/files/failure.png';
  }

  // Establece la página inicial desde los parámetros de la ruta
  private syncPageFromRoute(): void {
    this.route.params
      .pipe(
        map((params) => +params['page'] || 1),
        take(1),
      )
      .subscribe((page) => this.page.set(page));
  }

  // Reinicia la página si cambia la búsqueda
  private setupQueryWatcher(): void {
    effect(() => {
      const currentQuery = this.query();
      if (currentQuery && this.page() !== 1) {
        this.page.set(1);
      }
    });
  }

  // Carga los archivos desde el backend y actualiza metadatos de paginación
  private loadFilesData(request: {
    query: string;
    page: number;
    show: number;
  }) {
    return this.fileService
      .fetchFile(request.query, request.page, request.show)
      .pipe(
        map((response) => {
          const meta = this.paginationService.parseMeta(response.data.meta);
          this.meta.set(meta);
          return response.data.data as File[];
        }),
      );
  }

  // Muestra confirmación antes de eliminar un archivo
  private confirmDelete() {
    return Swal.fire({
      title: '¿Confirmar eliminación?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    });
  }

  // Ejecuta la eliminación y muestra el resultado
  private executeDelete(id: number): void {
    this.showLoading('Eliminando archivo...');

    this.fileService.deleteFile(id).subscribe({
      next: (success) => {
        Swal.close();
        this.showSuccess('¡Archivo eliminado!', success);
        this.filesResource.reload();
      },
      error: (error) => this.handleError('Error al eliminar', error),
    });
  }

  // Maneja la descarga exitosa del archivo
  private handleDownloadSuccess(
    response: HttpResponse<Blob>,
    fileName: string,
  ): void {
    Swal.close();

    const fileExtension = this.getFileExtension(response.headers, fileName);
    this.createDownloadLink(response.body!, `${fileName}${fileExtension}`);

    this.showSuccess(
      '¡Descarga completada!',
      'El archivo se ha descargado correctamente',
    );
  }

  // Crea un enlace de descarga temporal
  private createDownloadLink(blobData: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blobData);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  // Obtiene la extensión del archivo
  private getFileExtension(headers: HttpHeaders, fileName: string): string {
    const extensionFromName = fileName.substring(fileName.lastIndexOf('.'));
    if (extensionFromName) return '';

    const contentType = headers.get('Content-Type');
    const extensionMap: Record<string, string> = {
      'application/pdf': '.pdf',
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'application/zip': '.zip',
    };

    return extensionMap[contentType || ''] || '';
  }

  // Muestra un indicador de carga
  private showLoading(message: string): void {
    Swal.fire({
      title: message,
      html: 'Por favor espere',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
  }

  // Muestra un mensaje de éxito
  private showSuccess(title: string, message: string): void {
    Swal.fire({
      title,
      text: message,
      icon: 'success',
    });
  }

  // Maneja errores
  private handleError(title: string, error: any): void {
    Swal.close();
    const message =
      error.error?.message || error.message || 'Ocurrió un error inesperado';
    Swal.fire({
      title,
      text: message,
      icon: 'error',
    });
  }
}
