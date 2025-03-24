import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PopupService } from '../../../../services/popup.service';
import { Popup } from '../../../../interfaces/Popup';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { rxResource } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-index-popup',
  imports: [RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './index-popup.component.html',
  styleUrl: './index-popup.component.css',
})
export class IndexPopupComponent {
  private popupService = inject(PopupService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public show = signal<number>(50);
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
  }

  public popupsRs = rxResource<Popup[], { page: number; show: number }>({
    request: () => ({
      page: this.page(),
      show: this.show(),
    }),
    loader: ({ request }) => {
      return this.popupService.fetchPopup(request.page, request.show).pipe(
        switchMap((response) => {
          this.meta.set({
            current_page: response.meta?.current_page ?? 1,
            last_page: response.meta?.last_page ?? 1,
            from: response.meta?.from ?? 0,
            to: response.meta?.to ?? 0,
            total: response.meta?.total ?? 0,
            links:
              response.meta?.links?.map((link: any, index: number) => ({
                id: `link-${index}`,
                label: link.label ?? '',
                page: this.extractPage(link.url) ?? null,
                active: link.active ?? false,
              })) ?? [],
          });

          return [response.data.data];
        }),
      );
    },
  });

  public deleteItem(id: number) {
    Swal.fire({
      title: '¿Estás seguro que desea eliminar el popup?',
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

        this.popupService.deletePopup(id).subscribe({
          next: (success: string) => {
            Swal.close();
            Swal.fire({
              title: '¡Eliminado!',
              text: success,
              icon: 'success',
              confirmButtonColor: '#06048c',
              confirmButtonText: 'Cerrar',
            });
            this.popupsRs.reload();
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
      this.router.navigate(['admin/popups/page', page]);
    }
  }

  private extractPage(url: string | null): number | null {
    if (!url) return null;
    const match = url.match(/page=(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }
}
