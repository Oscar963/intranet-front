import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from '@services/file.service';
import { File } from '@interfaces/File';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ToastService } from '@services/toast.service';
import { ModalFileUploadComponent } from '@components/Admin/Modules/Page/modal-file-upload/modal-file-upload.component';
import { PageService } from '@services/page.service';
import { ModalUpdateFileUploadComponent } from '@components/Admin/Modules/Page/modal-update-file-upload/modal-update-file-upload.component';

/**
 * Componente para gestionar y visualizar archivos asociados a una página.
 * Permite la visualización, descarga, eliminación y actualización de archivos.
 */
@Component({
  selector: 'app-file-index-page',
  imports: [
    ReactiveFormsModule,
    ModalFileUploadComponent,
    ModalUpdateFileUploadComponent,
  ],
  templateUrl: './file-index-page.component.html',
  styleUrl: './file-index-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileIndexPageComponent {
  // Servicios
  private readonly fileService = inject(FileService);
  private readonly toastService = inject(ToastService);
  private readonly pageService = inject(PageService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Referencias
  public readonly uploadEditFile =
    viewChild.required<ModalUpdateFileUploadComponent>(
      'uploadModalFileEditRef',
    );

  // Estado
  public pageId = signal<number>(
    Number(this.route.snapshot.paramMap.get('idpage')),
  );
  public query = signal<string>('');
  public show = signal<number>(15);
  public meta = signal<any>({});
  public page = signal<number>(1);

  // Configuración
  public readonly values = [
    { value: '15', label: '15' },
    { value: '50', label: '50' },
    { value: '100', label: '100' },
    { value: '500', label: '500' },
  ];

  constructor() {
    this.setupEffects();
  }

  /**
   * Recurso reactivo para obtener la lista de archivos.
   * Actualiza automáticamente cuando cambian los parámetros de búsqueda.
   */
  public readonly filesRs = rxResource<
    File[],
    { idpage: number; query: string; page: number; show: number }
  >({
    request: () => ({
      idpage: this.pageId(),
      query: this.query(),
      page: this.page(),
      show: this.show(),
    }),
    loader: ({ request }) => {
      return this.pageService
        .fetchFile(request.idpage, request.query, request.page, request.show)
        .pipe(
          map((response) => {
            this.updateMeta(response.data.meta);
            return response.data.data as File[];
          }),
        );
    },
  });

  /**
   * Elimina un archivo después de confirmación del usuario.
   * @param id - ID del archivo a eliminar
   */
  public deleteItem(id: number): void {
    this.showDeleteConfirmation(id);
  }

  /**
   * Navega a una página específica de resultados.
   * @param page - Número de página a la que navegar
   */
  public goToPage(page: number | null): void {
    if (page && page > 0 && page <= this.meta().last_page) {
      this.router.navigate(['admin/pages/files', this.pageId(), 'page', page]);
    }
  }

  /**
   * Descarga un archivo específico.
   * @param fileId - ID del archivo a descargar
   * @param fileName - Nombre del archivo
   */
  public downloadFile(fileId: number, fileName: string): void {
    this.showLoadingIndicator('Descargando...');
    this.fileService.downloadFile(fileId).subscribe({
      next: (response) => this.handleDownloadSuccess(response, fileName),
      error: (error) => this.handleDownloadError(error),
    });
  }

  /**
   * Copia una URL al portapapeles.
   * @param text - Texto a copiar
   */
  public copyToClipboard(text: string): void {
    navigator.clipboard
      .writeText(text)
      .then(() => this.toastService.info('URL copiada al portapapeles.'))
      .catch(() => this.toastService.error('Error al copiar la URL.'));
  }

  /**
   * Abre el modal de edición para un archivo específico.
   * @param file - Datos del archivo a editar
   */
  public openModalEdit(file: any): void {
    this.uploadEditFile().openModal(file);
  }

  /**
   * Obtiene la ruta del icono según el tipo de archivo.
   * @param fileType - Tipo de archivo
   * @returns Ruta del icono correspondiente
   */
  public getFileImage(fileType: string): string {
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

  // Métodos privados
  private setupEffects(): void {
    effect(() => {
      this.route.params.subscribe((params) => {
        this.page.set(+params['page'] || 1);
      });
    });

    effect(() => {
      if (this.page() !== 1 && this.query() !== '') {
        this.page.set(1);
        this.router.navigate(['admin/pages/files', this.pageId()]);
      }
    });
  }

  private updateMeta(meta: any): void {
    this.meta.set({
      current_page: meta?.current_page ?? 1,
      last_page: meta?.last_page ?? 1,
      from: meta?.from ?? 0,
      to: meta?.to ?? 0,
      total: meta?.total ?? 0,
      links:
        meta?.links?.map((link: any, index: number) => ({
          id: `link-${index}`,
          label: link.label ?? '',
          page: this.extractPage(link.url) ?? null,
          active: link.active ?? false,
        })) ?? [],
    });
  }

  private showDeleteConfirmation(id: number): void {
    Swal.fire({
      title: '¿Estás seguro que desea eliminar el archivo?',
      text: '¡Esta acción no podrá ser revertida!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#06048c',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonColor: '#d63939',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.executeDelete(id);
      }
    });
  }

  private executeDelete(id: number): void {
    this.showLoadingIndicator('Eliminando...');
    this.fileService.deleteFile(id).subscribe({
      next: (success) => this.handleDeleteSuccess(success),
      error: (error) => this.handleDeleteError(error),
    });
  }

  private showLoadingIndicator(title: string): void {
    Swal.fire({
      title,
      html: 'Por favor, espera mientras se procesa la solicitud.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
  }

  private handleDeleteSuccess(success: string): void {
    Swal.close();
    Swal.fire({
      title: '¡Eliminado!',
      text: success,
      icon: 'success',
      confirmButtonColor: '#06048c',
      confirmButtonText: 'Cerrar',
    });
    this.filesRs.reload();
  }

  private handleDeleteError(error: any): void {
    Swal.close();
    Swal.fire({
      title: 'Error',
      text: error.message || 'No se pudo eliminar el registro.',
      icon: 'error',
      confirmButtonColor: '#d63939',
      confirmButtonText: 'Cerrar',
    });
  }

  private handleDownloadSuccess(
    response: HttpResponse<Blob>,
    fileName: string,
  ): void {
    Swal.close();
    const headers = response.headers;
    const fileExtension = this.getFileExtension(headers, fileName);
    const url = window.URL.createObjectURL(response.body!);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileExtension);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    Swal.fire({
      title: '¡Listo!',
      text: 'Archivo descargado',
      icon: 'success',
      confirmButtonColor: '#06048c',
      confirmButtonText: 'Cerrar',
    });
  }

  private handleDownloadError(error: any): void {
    Swal.close();
    const errorMessage =
      error.error?.message ||
      error.message ||
      'No se pudo descargar el archivo.';
    Swal.fire({
      title: 'Error',
      text: errorMessage,
      icon: 'error',
      confirmButtonColor: '#d63939',
      confirmButtonText: 'Cerrar',
    });
  }

  private extractPage(url: string | null): number | null {
    if (!url) return null;
    const match = url.match(/page=(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

  private getFileExtension(headers: HttpHeaders, fileName: string): string {
    let fileExtension = fileName.substring(fileName.lastIndexOf('.'));
    if (!fileExtension) {
      const contentType = headers.get('Content-Type');
      if (contentType) {
        if (contentType.startsWith('image/')) {
          fileExtension = '.jpg';
        } else if (contentType.startsWith('application/pdf')) {
          fileExtension = '.pdf';
        }
      }
    }
    return fileExtension;
  }
}
