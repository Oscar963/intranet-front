import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AnexoService } from '@services/anexo.service';
import { Anexo } from '@interfaces/Anexo';
import Swal from 'sweetalert2';
import { ImportAnexoComponent } from '../import-anexo/import-anexo.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-index-anexo',
  imports: [RouterLink, ImportAnexoComponent],
  templateUrl: './index-anexo.component.html',
  styleUrl: './index-anexo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexAnexoComponent {
  // Inyección de dependencias
  private anexoService = inject(AnexoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Estado reactivo con signals
  public query = signal<string>('');
  public show = signal<number>(15);
  public meta = signal<any>({});
  public page = signal<number>(1);

  // Opciones para el selector de cantidad de ítems a mostrar
  public values = [
    { value: '15', label: '15' },
    { value: '50', label: '50' },
    { value: '100', label: '100' },
    { value: '500', label: '500' },
  ];

  constructor() {
    // Sincroniza `page` con los parámetros de la URL
    effect(() => {
      this.route.params
        .pipe(map((params) => +params['page'] || 1))
        .subscribe(this.page.set);
    });

    // Efecto para actualizar la URL en 1 cuando se cambia la consulta
    effect(() => {
      if (this.page() !== 1 && this.query() !== '') {
        this.page.set(1);
        this.router.navigate(['admin/anexos/page', 1]);
      }
    });
  }

  // Recurso reactivo que obtiene los anexos
  public anexoRs = rxResource<
    Anexo[],
    { query: string; page: number; show: number }
  >({
    request: () => ({
      query: this.query(),
      page: this.page(),
      show: this.show(),
    }),
    loader: ({ request }) => {
      return this.anexoService
        .fetchAnexos(request.query, request.page, request.show)
        .pipe(
          // Usamos map para transformar la respuesta
          map((response) => {
            // Actualizamos la metadata
            this.meta.set({
              current_page: response.data.meta?.current_page ?? 1,
              last_page: response.data.meta?.last_page ?? 1,
              from: response.data.meta?.from ?? 0,
              to: response.data.meta?.to ?? 0,
              total: response.data.meta?.total ?? 0,
              links:
                response.data.meta?.links?.map((link: any, index: number) => ({
                  id: `link-${index}`, // Clave única generada para cada enlace
                  label: link.label ?? '',
                  page: this.extractPage(link.url) ?? null,
                  active: link.active ?? false,
                })) ?? [],
            });

            // Convertimos explícitamente a Anexo[] y retornamos los datos
            return response.data.data as Anexo[];
          }),
        );
    },
  });

  // Actualiza los metadatos de la paginación
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

  // Elimina un anexo con confirmación
  public deleteItem(id: number) {
    Swal.fire({
      title: '¿Estás seguro que desea eliminar el anexo?',
      text: '¡Esta acción no podrá ser revertida!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#06048c',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonColor: '#d63939',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoadingSwal();
        this.anexoService.deleteAnexo(id).subscribe({
          next: (success) => this.handleDeleteSuccess(success),
          error: (error) => this.handleDeleteError(error),
        });
      }
    });
  }

  // Muestra el mensaje de carga
  private showLoadingSwal(): void {
    Swal.fire({
      title: 'Eliminando...',
      html: 'Por favor, espera mientras se elimina el registro.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
  }

  // Maneja el éxito al eliminar un anexo
  private handleDeleteSuccess(success: string): void {
    Swal.close();
    Swal.fire({
      title: '¡Eliminado!',
      text: success,
      icon: 'success',
      confirmButtonColor: '#06048c',
      confirmButtonText: 'Cerrar',
    });
    this.anexoRs.reload(); // Recargar la lista
  }

  // Maneja errores al eliminar un anexo
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

  // Navegación entre páginas con validación estricta
  public goToPage(page: number | null): void {
    if (typeof page === 'number' && page > 0 && page <= this.meta().last_page) {
      this.router.navigate(['admin/anexos/page', page]);
    }
  }

  // Extrae el número de página desde una URL
  private extractPage(url: string | null): number | null {
    if (!url) return null;
    const match = url.match(/page=(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }
}
