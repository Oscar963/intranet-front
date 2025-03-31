import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PageService } from '@services/page.service';
import { Page } from '@interfaces/Page';
import Swal from 'sweetalert2';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-index-page',
  imports: [RouterLink],
  templateUrl: './index-page.component.html',
  styleUrl: './index-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexPageComponent {
  private pageService = inject(PageService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public query = signal<string>('');
  public show = signal<number>(15);
  public meta = signal<any>({});
  public page = signal<number>(1);

  values = [
    { value: '15', label: '15' },
    { value: '50', label: '50' },
    { value: '100', label: '100' },
    { value: '500', label: '500' },
  ];

  constructor() {
    // Efecto para sincronizar `page` con la URL
    effect(() => {
      this.route.params.subscribe((params) => {
        this.page.set(+params['page'] || 1);
      });
    });
    // Efecto para actualizar la URL en 1 cuando se cambia la consulta
    effect(() => {
      if (this.page() !== 1 && this.query() !== '') {
        this.page.set(1);
        this.router.navigate(['admin/pages/page', 1]);
      }
    });
  }

  public pagesRs = rxResource<
    Page[],
    { query: string; page: number; show: number }
  >({
    request: () => ({
      query: this.query(),
      page: this.page(),
      show: this.show(),
    }),
    loader: ({ request }) => {
      return this.pageService
        .fetchPage(request.query, request.page, request.show)
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

            // Convertimos explícitamente a Page[] y retornamos los datos
            return response.data.data as Page[];
          }),
        );
    },
  });

  public deleteItem(id: number) {
    Swal.fire({
      title: '¿Estás seguro que desea eliminar la página?',
      text: '¡Esta acción no podrá ser revertida!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#06048c',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonColor: '#d63939',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Eliminando...',
          html: 'Por favor, espera mientras se elimina el registro.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        this.pageService.deletePage(id).subscribe({
          next: (success: string) => {
            Swal.close();
            Swal.fire({
              title: '¡Eliminado!',
              text: success,
              icon: 'success',
              confirmButtonColor: '#06048c',
              confirmButtonText: 'Cerrar',
            });
            this.pagesRs.reload();
          },
          error: (error) => {
            Swal.close();
            Swal.fire({
              title: 'Error',
              text: error.message || 'No se pudo eliminar el registro.',
              icon: 'error',
              confirmButtonColor: '#d63939',
              confirmButtonText: 'Cerrar',
            });
          },
        });
      }
    });
  }

  public goToPage(page: number | null): void {
    if (page && page > 0 && page <= this.meta().last_page) {
      this.router.navigate(['admin/pages/page', page]);
    }
  }

  private extractPage(url: string | null): number | null {
    if (!url) return null;
    const match = url.match(/page=(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

  public copyToClipboard(slug: string): void {
    const baseUrl = window.location.origin; // Obtiene la URL base (ej. http://localhost:4200 o https://midominio.com)
    const fullUrl = `${baseUrl}/page/${slug}`; // Construye la URL completa

    navigator.clipboard
      .writeText(fullUrl)
      .then(() => {
        this.toastService.info('URL copiada al portapapeles.');
      })
      .catch((err) => {
        this.toastService.error('Error al copiar al portapapeles', err);
      });
  }
}
