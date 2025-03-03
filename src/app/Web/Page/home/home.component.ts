import { Component, inject } from '@angular/core';
import { WebService } from '../../../services/web.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private webService = inject(WebService);
  public banners: any[] = []; // Lista para almacenar los banners
  public loading: boolean = true; // Indicador de carga

  constructor() {}

  ngOnInit(): void {
    this.loadBanners();
  }

  loadBanners(): void {
    this.loading = true;
    this.webService.fetchBanners().subscribe({
      next: (response) => {
        this.banners = response.data;
      },
      error: (error) => {
        console.error('Error al cargar banners:', error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
