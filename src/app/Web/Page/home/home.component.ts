import { Component, effect, inject } from '@angular/core';
import { WebService } from '../../../services/web.service';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private webService = inject(WebService);

  // constructor() {
  //   effect(() => {
  //     console.log('Banners cargados:', this.bannersRx.value());
  //   });
  // }

  //Con rxResource se carga automáticamente los datos de los banners, se filtran los que estén publicados y no hayan expirado
  public bannersRx = rxResource({
    loader: () =>
      this.webService.fetchBanners().pipe(map((response) => response.data)),
  });
}
