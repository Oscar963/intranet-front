import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  inject,
  effect,
  signal,
  ChangeDetectionStrategy,
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
  @ViewChild('modalPopUp', { static: true }) modalRef!: ElementRef;
  @ViewChild('modalInit', { static: true }) modalInitRef!: ElementRef;

  private webService = inject(WebService);
  public modal = signal<Modal | null>(null);
  public modal2 = signal<Modal | null>(null);

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
    const modalInstance = new Modal(this.modalRef.nativeElement);
    this.modal.set(modalInstance);

    const modalInstanceInit = new Modal(this.modalInitRef.nativeElement);
    this.modal2.set(modalInstanceInit);
  }

  openModal() {
    const modalInstance = this.modal();
    if (modalInstance) {
      modalInstance.show();
    }

    const modalInstanceInit = this.modal2();
    if (modalInstanceInit) {
      modalInstanceInit.show();
    }
  }

  openModal2() {
    const modalInstanceInit = this.modal2();
    if (modalInstanceInit) {
      modalInstanceInit.show();
    }
  }

  ngAfterViewInit(): void {
    this.setModal(); // Inicializa el modal después de que la vista esté completamente inicializada
    this.openModal2();
  }

  constructor() {
    effect(() => {
      if (this.popUpsRx.value() && this.popUpsRx.value().length > 0) {
        this.openModal(); // Abre el modal si hay popups
      }
    });
  }
}
