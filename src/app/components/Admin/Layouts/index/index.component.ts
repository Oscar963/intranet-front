import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { AuthService } from '@services/auth.service';
import { User } from '@interfaces/User';
import { HeaderComponent } from '../header/header.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-index',
  imports: [RouterOutlet, HeaderComponent, NavbarComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexAdminComponent {
  // Services
  private readonly authService = inject(AuthService);

  // State
  public userResource = rxResource<User, void>({
    loader: () =>
      this.authService
        .getUserObservable()
        .pipe(tap((user) => console.debug('Usuario obtenido:', user))),
  });

  // Computed
  public avatarName = computed(() =>
    this.extractInitials(this.userResource.value()),
  );

  private extractInitials(user?: User): string {
    if (!user) return '';

    return [
      user.name?.[0]?.toUpperCase(),
      user.paternal_surname?.[0]?.toUpperCase(),
    ]
      .filter(Boolean)
      .join('');
  }
}
