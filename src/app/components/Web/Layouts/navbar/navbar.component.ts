import {
  ChangeDetectionStrategy,
  Component,
  viewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ModalSearchFileComponent } from '@components/Web/Utils/modal-search-file/modal-search-file.component';
@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
    ModalSearchFileComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  public modalSearchFile =
    viewChild.required<ModalSearchFileComponent>('modalSearchFileRef');

  openModal() {
    this.modalSearchFile().openModal();
  }
}
