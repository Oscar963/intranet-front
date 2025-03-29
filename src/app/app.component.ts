import { RouterOutlet } from '@angular/router';
import { Component, computed, effect, inject } from '@angular/core';
import { LoadingService } from '@services/loading.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Intranet Municipalidad de la municipalidad de Arica';
  city = 'Chile';

  private loadingService = inject(LoadingService);

  // Computed para manejar el estado de carga
  isLoading = computed(() => this.loadingService.isLoading());
}
