import { Component, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { WebService } from '@services/web.service';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-anexos',
  imports: [FormsModule],
  templateUrl: './anexos.component.html',
  styleUrl: './anexos.component.css',
})
export class AnexosComponent {
  private webService = inject(WebService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public query = signal<string>('');
  public show = signal<number>(50);
  public meta = signal<any>({});
  public page = signal<number>(1);

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
        this.router.navigate(['anexos/page', 1]);
      }
    });
  }

  public anexosRs = rxResource({
    request: () => ({
      query: this.query(),
      page: this.page(),
      show: this.show(),
    }),
    loader: ({ request }) => {
      return this.webService
        .searchAnexos(request.query, request.page, request.show)
        .pipe(
          switchMap((response) => {
            this.meta.set({
              current_page: response.meta?.current_page ?? 1,
              last_page: response.meta?.last_page ?? 1,
              from: response.meta?.from ?? 0,
              to: response.meta?.to ?? 0,
              total: response.meta?.total ?? 0,
              links:
                response.meta?.links?.map((link: any, index: number) => ({
                  id: `link-${index}`, // Clave única generada para cada enlace
                  label: link.label ?? '',
                  page: this.extractPage(link.url) ?? null,
                  active: link.active ?? false,
                })) ?? [],
            });

            // Devolver solo los datos que necesitamos para el recurso
            return [response.data];
          }),
        );
    },
  });

  public goToPage(page: number | null): void {
    if (page && page > 0 && page <= this.meta().last_page) {
      this.router.navigate(['anexos/page', page]);
    }
  }

  private extractPage(url: string | null): number | null {
    if (!url) return null;
    const match = url.match(/page=(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }
}
