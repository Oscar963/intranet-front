import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PageService } from '../../../../services/page.service';
import { Page } from '../../../../interfaces/Page';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../../../services/notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-index-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './index-page.component.html',
  styleUrl: './index-page.component.css',
})
export class IndexPageComponent {
  private pageService = inject(PageService);
  private notificationService = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public errorMessage: string = '';
  public successMessage: string | null = null;

  public pages: Page[] = [];
  public show: number = 15;
  public meta: any = {};
  public links: any = {};
  public loading: boolean = false;
  public currentPage: number = 1;

  values = [
    { value: '15', label: '15' },
    { value: '50', label: '50' },
    { value: '100', label: '100' },
    { value: '500', label: '500' },
  ];

  form = new FormGroup({
    show: new FormControl(this.values[0]?.value),
  });

  ngOnInit() {
    // Escuchar mensajes de éxito y error
    this.notificationService.successMessage$.subscribe(
      (message) => (this.successMessage = message)
    );
    // Obtener el número de página desde la URL al inicializar el componente
    this.route.params.subscribe((params) => {
      const page = +params['page'] || 1;
      this.currentPage = page;
      this.loadPages(this.currentPage, this.show);
    });
  }

  loadPages(page: number, show: number): void {
    this.loading = true;

    this.pageService.fetchPage(page, show).subscribe({
      next: (response) => {
        this.pages = response.data.data;
        this.meta = {
          current_page: response.data.meta.current_page,
          last_page: response.data.meta.last_page,
          from: response.data.meta.from,
          to: response.data.meta.to,
          total: response.data.meta.total,
          links: response.data.meta.links.map((link: any, index: number) => ({
            id: `link-${index}`, // Clave única generada para cada enlace
            label: link.label,
            page: this.extractPage(link.url),
            active: link.active,
          })),
        };
        this.links = {
          first: response.data.links.first,
          last: response.data.links.last,
          next: response.data.links.next,
          prev: response.data.links.prev,
        };
      },
      error: (error) => {
        console.error('Error al obtener los pages:', error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  goToPage(page: number | null): void {
    if (page && page > 0 && page <= this.meta.last_page) {
      this.router.navigate(['admin/pages/page', page]);
    }
  }

  copyToClipboard(slug: string): void {
    const baseUrl = window.location.origin; // Obtiene la URL base (ej. http://localhost:4200 o https://midominio.com)
    const fullUrl = `${baseUrl}/page/${slug}`; // Construye la URL completa
  
    navigator.clipboard
      .writeText(fullUrl)
      .then(() => {
        alert('URL copiada al portapapeles.');
        this.notificationService.showSuccess('URL copiada al portapapeles.');
      })
      .catch((err) => {
        this.notificationService.showError('Error al copiar la URL.');
        console.error('Error al copiar al portapapeles:', err);
      });
  }

  deleteItem(id: number) {
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
            this.loadPages(this.currentPage, this.show);
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

  onChange(e: any) {
    this.show = e.target.value;
    this.router.navigate(['admin/pages/page', 1]);
    this.currentPage = 1;
    this.loadPages(this.currentPage, this.show);
  }

  private extractPage(url: string | null): number | null {
    if (!url) return null;
    const match = url.match(/page=(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }
}
