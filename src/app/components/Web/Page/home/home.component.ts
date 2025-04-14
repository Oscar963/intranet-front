import {
  Component,
  ElementRef,
  AfterViewInit,
  inject,
  effect,
  signal,
  ChangeDetectionStrategy,
  viewChild,
} from '@angular/core';
import { WebService } from '@services/web.service';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements AfterViewInit {
  public modalPopUp = viewChild.required<ElementRef>('modalPopUpRef');
  public modal = signal<Modal | null>(null);
  private webService = inject(WebService);


  // Con rxResource se carga automáticamente los datos de los banners
  public bannersRx = rxResource({
    loader: () =>
      this.webService.fetchBanners().pipe(map((response) => response.data)),
  });
  public popUpsRx = rxResource({
    loader: () =>
      this.webService.fetchPopups().pipe(map((response) => response.data)),
  });

  setModal() {
    const modalInstance = new Modal(this.modalPopUp().nativeElement);
    this.modal.set(modalInstance);
  }

  openModal() {
    const modalInstance = this.modal();
    if (modalInstance) {
      modalInstance.show();
    }
  }

  ngAfterViewInit(): void {
    this.setModal(); // Inicializa el modal después de que la vista esté completamente inicializada
  }

  constructor() {
    effect(() => {
      if (this.popUpsRx.value() && this.popUpsRx.value().length > 0) {
        this.openModal(); // Abre el modal si hay popups
      }
    });
  }
}
