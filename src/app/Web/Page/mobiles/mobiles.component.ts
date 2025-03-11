import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebService } from '../../../services/web.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Mobile } from '../../../interfaces/Mobile';

@Component({
  selector: 'app-mobiles',
  imports: [ReactiveFormsModule],
  templateUrl: './mobiles.component.html',
  styleUrl: './mobiles.component.css',
})
export class MobilesComponent {
  private webService = inject(WebService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public mobiles: Mobile[] = [];
  public show: number = 15;
  public meta: any = {};
  public links: any = {};
  public loading: boolean = false;
  public currentPage: number = 1;

  form = new FormGroup({
    query: new FormControl(''),
    show: new FormControl(15),
  });

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const page = +params['page'] || 1;
      this.currentPage = page;
      this.loadMobiles(this.form.value.query || '', this.currentPage, this.show);
    });
  }

  onSubmit(): void {
    this.router.navigate(['mobiles/page', 1]);
    this.currentPage = 1;
    this.loadMobiles(this.form.value.query || '', this.currentPage, this.show);
  }

  loadMobiles(query: string, page: number, show: number): void {
    this.loading = true;

    this.webService.searchMobiles(query, page, show).subscribe({
      next: (response) => {        
        this.mobiles = response.data;
        this.meta = {
          current_page: response.meta.current_page,
          last_page: response.meta.last_page,
          from: response.meta.from,
          to: response.meta.to,
          total: response.meta.total,
          links: response.meta.links.map((link: any, index: number) => ({
            id: `link-${index}`, // Clave única generada para cada enlace
            label: link.label,
            page: this.extractPage(link.url),
            active: link.active,
          })),
        };
        this.links = {
          first: response.links.first,
          last: response.links.last,
          next: response.links.next,
          prev: response.links.prev,
        };
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  goToPage(page: number | null): void {
    if (page && page > 0 && page <= this.meta.last_page) {
      this.router.navigate(['mobiles/page', page]);
    }
  }

  extractPage(url: string | null): number | null {
    if (!url) return null;
    const match = url.match(/page=(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }
}
