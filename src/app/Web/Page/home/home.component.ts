import { Component, effect, inject, signal } from '@angular/core';
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

  //Con rxResource se carga automáticamente los datos de los banners, se filtran los que estén publicados y no hayan expirado
  public bannersRx = rxResource({
    loader: () =>
      this.webService.fetchBanners().pipe(
        map((response) =>
          response.data.filter((banner: any) => {
            const now = new Date(); // Fecha y hora actual
            const expirationDate = new Date(banner.date_expiration);
            return banner.status === 'published' && expirationDate > now;
          }),
        ),
      ),
  });
}
