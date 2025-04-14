/** Componente principal para listar y gestionar usuarios */
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, take } from 'rxjs';
import Swal from 'sweetalert2';

import { UserService } from '@services/user.service';
import { AuthService } from '@services/auth.service';
import { User } from '@interfaces/User';
import { PaginationService } from '@services/pagination.service';
import { PaginationMeta } from '@interfaces/pagination';

@Component({
  selector: 'app-index-user',
  imports: [RouterLink],
  templateUrl: './index-user.component.html',
  styleUrl: './index-user.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexUserComponent {
  // Servicios inyectados
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly paginationService = inject(PaginationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Estado de búsqueda, paginación y metadatos
  public query = signal<string>('');
  public show = signal<number>(15);
  public page = signal<number>(1);
  public meta = signal<PaginationMeta>(this.paginationService.defaultMeta());

  // Opciones para cantidad de ítems por página
  public readonly itemsPerPageOptions = [
    { value: 15, label: '15' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
    { value: 500, label: '500' },
  ];

  // Recursos reactivos
  public readonly usersResource = rxResource<
    User[],
    { query: string; page: number; show: number }
  >({
    request: () => ({
      query: this.query(),
      page: this.page(),
      show: this.show(),
    }),
    loader: ({ request }) => this.loadUsersData(request),
  });

  public readonly currentUserResource = rxResource<User, void>({
    loader: () => this.authService.getUserObservable(),
  });

  constructor() {
    this.syncPageFromRoute(); // Inicializa el número de página desde la URL
    this.setupQueryWatcher(); // Reinicia la página al cambiar la búsqueda
  }

  /** Elimina un usuario con confirmación previa */
  public deleteItem(id: number): void {
    this.confirmDelete().then((result) => {
      if (result.isConfirmed) {
        this.executeDelete(id);
      }
    });
  }

  /** Navega a la página indicada si es válida */
  public goToPage(page: number | null): void {
    if (this.paginationService.isValidPage(page, this.meta().last_page)) {
      this.router.navigate(['admin/users/page', page]);
    }
  }

  // Establece la página inicial desde los parámetros de la ruta
  private syncPageFromRoute(): void {
    this.route.params
      .pipe(
        map((params) => +params['page'] || 1),
        take(1),
      )
      .subscribe((page) => this.page.set(page));
  }

  // Reinicia la página si cambia la búsqueda
  private setupQueryWatcher(): void {
    effect(() => {
      const currentQuery = this.query();
      if (currentQuery && this.page() !== 1) {
        this.page.set(1);
      }
    });
  }

  // Carga los usuarios desde el backend y actualiza metadatos de paginación
  private loadUsersData(request: {
    query: string;
    page: number;
    show: number;
  }) {
    return this.userService
      .fetchUsers(request.query, request.page, request.show)
      .pipe(
        map((response) => {
          const meta = this.paginationService.parseMeta(response.data.meta);
          this.meta.set(meta);
          return response.data.data as User[];
        }),
      );
  }

  // Muestra confirmación antes de eliminar un usuario
  private confirmDelete() {
    return Swal.fire({
      title: '¿Confirmar eliminación?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    });
  }

  // Ejecuta la eliminación y muestra el resultado
  private executeDelete(id: number): void {
    Swal.fire({
      title: 'Eliminando...',
      html: 'Por favor espere',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    this.userService.deleteUser(id).subscribe({
      next: (success) => {
        Swal.close();
        Swal.fire('Eliminado', success, 'success');
        this.usersResource.reload();
      },
      error: (error) => {
        Swal.close();
        Swal.fire('Error', error.message || 'Ocurrió un error', 'error');
      },
    });
  }
}
