import { Router, RouterLink } from '@angular/router';
import { User } from '../../../interfaces/User';
import { Component, inject, input } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  user = input<User>({
    id: 0,
    name: '',
    paternal_surname: '',
    maternal_surname: '',
    rut: '',
    email: '',
    status: 0,
  });
  nameAvatar = input<string>('');

  private authService = inject(AuthService);
  private router = inject(Router);

  public loading: boolean = false;
  public validationErrors: string[] = [];
  public showPassword: boolean = false;
  public errorMessage: string = '';
  public successMessage: string = '';

  logout(): void {
    this.authService.logout().subscribe({
      next: (response: string) => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error;
      },
    });
  }
}
