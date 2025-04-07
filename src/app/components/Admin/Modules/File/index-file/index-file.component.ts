import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FileService } from '@services/file.service';
import { File } from '@interfaces/File';
import Swal from 'sweetalert2';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-index-file',
  imports: [RouterLink],
  templateUrl: './index-file.component.html',
  styleUrls: ['./index-file.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexFileComponent {
  // === SERVICIOS INYECTADOS === //
  private readonly fileService = inject(FileService); // Servicio para operaciones con archivos
  private readonly toastService = inject(ToastService); // Servicio para notificaciones
  private readonly route = inject(ActivatedRoute); // Acceso a parámetros de ruta
  private readonly router = inject(Router); // Navegación programática

  // === ESTADOS REACTIVOS === //
  public query = signal<string>(''); // 🔹 Término de búsqueda actual
  public show = signal<number>(15); // 🔹 Items mostrados por página
  public meta = signal<PaginationMeta>({
    // 🔹 Metadatos de paginación
    current_page: 1,
    last_page: 1,
    from: 0,
    to: 0,
    total: 0,
    links: [],
  });
  public page = signal<number>(1); // 🔹 Página actual

  // === CONSTANTES === //
  public readonly itemsPerPageOptions = [
    // 🔸 Opciones para items por página
    { value: 15, label: '15' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
    { value: 500, label: '500' },
  ];

  constructor() {
    // === EFECTOS REACTIVOS === //
    this.setupRouteSync(); // Sincroniza parámetros de ruta
    this.setupQueryReset(); // Resetea a página 1 al buscar
  }

  // === RECURSO REACTIVO PARA DATOS === //
  public readonly filesResource = rxResource<
    File[],
    { query: string; page: number; show: number }
  >({
    request: () => ({
      query: this.query(),
      page: this.page(),
      show: this.show(),
    }),
    loader: ({ request }) => this.loadFiles(request),
  });

  // === MÉTODOS PÚBLICOS === //

  /**
   * Elimina un archivo con confirmación visual
   * @param id - ID del archivo a eliminar
   */
  public deleteItem(id: number): void {
    this.showDeleteConfirmation().then((result) => {
      if (result.isConfirmed) {
        this.executeDelete(id);
      }
    });
  }

  /**
   * Navega a una página específica con validación
   * @param page - Número de página destino
   */
  public goToPage(page: number | null): void {
    if (this.isValidPage(page)) {
      this.router.navigate(['admin/files/page', page]);
    }
  }

  /**
   * Descarga un archivo del servidor
   * @param fileId - ID del archivo a descargar
   * @param fileName - Nombre original del archivo
   */
  public downloadFile(fileId: number, fileName: string): void {
    this.showDownloadLoading();
    this.fileService.downloadFile(fileId).subscribe({
      next: (response) => {
        this.handleDownloadSuccess(response, fileName);
      },
      error: (error) => this.handleDownloadError(error),
    });
  }

  /**
   * Copia texto al portapapeles
   * @param text - Texto a copiar
   */
  public copyToClipboard(text: string): void {
    navigator.clipboard
      .writeText(text)
      .then(() => this.toastService.info('URL copiada al portapapeles'))
      .catch((err) => this.toastService.error('Error al copiar', err));
  }

  /**
   * Obtiene la ruta del icono según el tipo de archivo
   * @param fileType - Tipo de archivo
   * @returns Ruta del icono correspondiente
   */
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

  // === MÉTODOS PRIVADOS === //

  /**
   * Sincroniza los parámetros de ruta con el estado interno
   */
  private setupRouteSync(): void {
    effect(() => {
      this.route.params.subscribe((params) => {
        this.page.set(+params['page'] || 1);
      });
    });
  }

  /**
   * Configura el reset a página 1 cuando cambia la query
   */
  private setupQueryReset(): void {
    effect(() => {
      if (this.query() && this.page() !== 1) {
        this.resetToFirstPage();
      }
    });
  }

  /**
   * Carga los archivos desde el servicio
   * @param request Parámetros de búsqueda
   * @returns Observable con lista de archivos
   */
  private loadFiles(request: { query: string; page: number; show: number }) {
    return this.fileService
      .fetchFile(request.query, request.page, request.show)
      .pipe(
        map((response) => {
          this.updatePaginationMeta(response.data.meta);
          return response.data.data as File[];
        }),
      );
  }

  /**
   * Actualiza los metadatos de paginación
   * @param meta Metadatos de la API
   */
  private updatePaginationMeta(meta: any): void {
    this.meta.set({
      current_page: meta?.current_page ?? 1,
      last_page: meta?.last_page ?? 1,
      from: meta?.from ?? 0,
      to: meta?.to ?? 0,
      total: meta?.total ?? 0,
      links: this.parsePaginationLinks(meta?.links),
    });
  }

  /**
   * Parsea los enlaces de paginación
   * @param links Enlaces crudos de la API
   * @returns Array de enlaces formateados
   */
  private parsePaginationLinks(links: any[]): PaginationLink[] {
    return (
      links?.map((link, index) => ({
        id: `link-${index}`,
        label: link.label ?? '',
        page: this.extractPageFromUrl(link.url),
        active: link.active ?? false,
      })) ?? []
    );
  }

  /**
   * Extrae el número de página de una URL
   * @param url URL a analizar
   * @returns Número de página o null
   */
  private extractPageFromUrl(url: string | null): number | null {
    if (!url) return null;
    const match = url.match(/page=(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

  /**
   * Muestra diálogo de confirmación para eliminar
   * @returns Promise con resultado de la confirmación
   */
  private showDeleteConfirmation() {
    return Swal.fire({
      title: '¿Eliminar archivo?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#06048c',
      confirmButtonText: 'Confirmar',
      cancelButtonColor: '#d63939',
      cancelButtonText: 'Cancelar',
    });
  }

  /**
   * Ejecuta el proceso de eliminación
   * @param id ID del archivo a eliminar
   */
  private executeDelete(id: number): void {
    this.showLoadingIndicator('Eliminando archivo...');
    this.fileService.deleteFile(id).subscribe({
      next: (success) => this.handleDeleteSuccess(success),
      error: (error) => this.handleDeleteError(error),
    });
  }

  /**
   * Muestra indicador de carga
   * @param message Mensaje a mostrar
   */
  private showLoadingIndicator(message: string): void {
    Swal.fire({
      title: message,
      html: 'Por favor espere',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
  }

  /**
   * Muestra indicador de carga para descarga
   */
  private showDownloadLoading(): void {
    this.showLoadingIndicator('Descargando archivo...');
  }

  /**
   * Maneja eliminación exitosa
   * @param success Mensaje de confirmación
   */
  private handleDeleteSuccess(success: string): void {
    Swal.close();
    this.showSuccessAlert('¡Archivo eliminado!', success);
    this.filesResource.reload();
  }

  /**
   * Maneja descarga exitosa
   * @param response Respuesta HTTP
   * @param fileName Nombre original del archivo
   */
  private handleDownloadSuccess(
    response: HttpResponse<Blob>,
    fileName: string,
  ): void {
    Swal.close();

    const fileExtension = this.determineFileExtension(
      response.headers,
      fileName,
    );
    this.createDownloadLink(response.body!, `${fileExtension}`);

    this.showSuccessAlert(
      '¡Descarga completada!',
      'El archivo se ha descargado correctamente',
    );
  }

  /**
   * Crea enlace de descarga
   * @param blobData Datos del archivo
   * @param fileName Nombre completo del archivo
   */
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

  /**
   * Determina la extensión del archivo
   * @param headers Cabeceras HTTP
   * @param fileName Nombre del archivo
   * @returns Extensión del archivo
   */
  private determineFileExtension(
    headers: HttpHeaders,
    fileName: string,
  ): string {
    const extensionFromName = fileName.substring(fileName.lastIndexOf('.'));
    if (extensionFromName) return extensionFromName;

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

  /**
   * Maneja errores durante eliminación
   * @param error Error recibido
   */
  private handleDeleteError(error: any): void {
    Swal.close();
    this.showErrorAlert('Error al eliminar', this.getErrorMessage(error));
  }

  /**
   * Maneja errores durante descarga
   * @param error Error recibido
   */
  private handleDownloadError(error: any): void {
    Swal.close();
    this.showErrorAlert('Error al descargar', this.getErrorMessage(error));
  }

  /**
   * Obtiene mensaje de error
   * @param error Objeto de error
   * @returns Mensaje de error
   */
  private getErrorMessage(error: any): string {
    return (
      error.error?.message || error.message || 'Ocurrió un error inesperado'
    );
  }

  /**
   * Muestra alerta de éxito
   * @param title Título de la alerta
   * @param message Mensaje de la alerta
   */
  private showSuccessAlert(title: string, message: string): void {
    Swal.fire({
      title,
      text: message,
      icon: 'success',
      confirmButtonColor: '#06048c',
    });
  }

  /**
   * Muestra alerta de error
   * @param title Título de la alerta
   * @param message Mensaje de la alerta
   */
  private showErrorAlert(title: string, message: string): void {
    Swal.fire({
      title,
      text: message,
      icon: 'error',
      confirmButtonColor: '#d63939',
    });
  }

  /**
   * Valida si una página es navegable
   * @param page Página a validar
   * @returns true si la página es válida
   */
  private isValidPage(page: number | null): boolean {
    return !!page && page > 0 && page <= this.meta().last_page;
  }

  /**
   * Reinicia a la primera página
   */
  private resetToFirstPage(): void {
    this.page.set(1);
    this.router.navigate(['admin/files/page', 1]);
  }
}

// === INTERFACES DE TIPADO === //
interface PaginationMeta {
  current_page: number;
  last_page: number;
  from: number;
  to: number;
  total: number;
  links: PaginationLink[];
}

interface PaginationLink {
  id: string;
  label: string;
  page: number | null;
  active: boolean;
}
