import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PopupService } from '@services/popup.service';
import { Popup } from '@interfaces/Popup';
import Swal from 'sweetalert2';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-index-popup',
  imports: [RouterLink],
  templateUrl: './index-popup.component.html',
  styleUrl: './index-popup.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexPopupComponent {
  // === INYECCIÓN DE DEPENDENCIAS === //
  private readonly popupService = inject(PopupService); // 🔹 Servicio de popups
  private readonly route = inject(ActivatedRoute); // 🔹 Acceso a parámetros de ruta
  private readonly router = inject(Router); // 🔹 Navegación programática

  // === ESTADOS REACTIVOS (SIGNALS) === //
  public query = signal<string>(''); // 🔹 Término de búsqueda
  public show = signal<number>(15); // 🔹 Items por página
  public meta = signal<PaginationMeta>({
    // 🔹 Metadatos paginación
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
    // 🔸 Opciones de paginación
    { value: 15, label: '15' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
    { value: 500, label: '500' },
  ];

  constructor() {
    // === CONFIGURACIÓN INICIAL === //
    this.setupRouteSync(); // Sincroniza parámetros de ruta
    this.setupQueryDebounce(); // Configura debounce para búsquedas
  }

  // === RECURSO REACTIVO PARA DATOS === //
  public readonly popupsResource = rxResource<
    Popup[],
    { query: string; page: number; show: number }
  >({
    request: () => ({
      query: this.query(),
      page: this.page(),
      show: this.show(),
    }),
    loader: ({ request }) => this.loadPopupsData(request),
  });

  // === MÉTODOS PÚBLICOS === //

  /**
   * Elimina un popup con confirmación visual
   * @param id - ID del popup a eliminar
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
   * @param page - Número de página destino (1-based)
   */
  public goToPage(page: number | null): void {
    if (this.isValidPage(page)) {
      this.router.navigate(['admin/popups/page', page]);
    }
  }

  // === MÉTODOS PRIVADOS === //

  /**
   * Sincroniza los parámetros de ruta con el estado interno
   */
  private setupRouteSync(): void {
    this.route.params
      .pipe(map((params) => +params['page'] || 1))
      .subscribe((page) => this.page.set(page));
  }

  /**
   * Configura el debounce para cambios en la búsqueda
   */
  private setupQueryDebounce(): void {
    effect(() => {
      const currentQuery = this.query();
      if (currentQuery && this.page() !== 1) {
        this.resetToFirstPage();
      }
    });
  }

  /**
   * Carga los datos de popups desde el servicio
   * @param request - Parámetros de búsqueda y paginación
   * @returns Observable con los datos
   */
  private loadPopupsData(request: {
    query: string;
    page: number;
    show: number;
  }) {
    return this.popupService
      .fetchPopup(request.query, request.page, request.show)
      .pipe(
        map((response) => {
          this.updatePaginationMeta(response.data.meta);
          return response.data.data as Popup[];
        }),
      );
  }

  /**
   * Actualiza los metadatos de paginación
   * @param meta - Metadatos de la API
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
   * @param links - Enlaces crudos de la API
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
   * @param url - URL a analizar
   * @returns Número de página o null
   */
  private extractPageFromUrl(url: string | null): number | null {
    if (!url) return null;
    try {
      const parsedUrl = new URL(url);
      return +(parsedUrl.searchParams.get('page') || 0);
    } catch {
      return null;
    }
  }

  /**
   * Muestra diálogo de confirmación para eliminar
   * @returns Promise con resultado de la confirmación
   */
  private showDeleteConfirmation() {
    return Swal.fire({
      title: '¿Eliminar popup?',
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
   * @param id - ID del popup a eliminar
   */
  private executeDelete(id: number): void {
    this.showLoadingIndicator();
    this.popupService.deletePopup(id).subscribe({
      next: (success) => this.handleDeleteSuccess(success),
      error: (error) => this.handleDeleteError(error),
    });
  }

  /**
   * Muestra indicador de carga durante eliminación
   */
  private showLoadingIndicator(): void {
    Swal.fire({
      title: 'Eliminando...',
      html: 'Por favor espere',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
  }

  /**
   * Maneja eliminación exitosa
   * @param success - Mensaje de confirmación
   */
  private handleDeleteSuccess(success: string): void {
    Swal.close();
    this.showSuccessAlert(success);
    this.popupsResource.reload();
  }

  /**
   * Muestra alerta de éxito
   * @param message - Mensaje a mostrar
   */
  private showSuccessAlert(message: string): void {
    Swal.fire({
      title: '¡Eliminado!',
      text: message,
      icon: 'success',
      confirmButtonColor: '#06048c',
    });
  }

  /**
   * Maneja errores durante eliminación
   * @param error - Error recibido
   */
  private handleDeleteError(error: any): void {
    Swal.close();
    this.showErrorAlert(error.message || 'Error al eliminar');
  }

  /**
   * Muestra alerta de error
   * @param message - Mensaje de error
   */
  private showErrorAlert(message: string): void {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonColor: '#d63939',
    });
  }

  /**
   * Valida si una página es navegable
   * @param page - Página a validar
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
    this.router.navigate(['admin/popups/page', 1]);
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
