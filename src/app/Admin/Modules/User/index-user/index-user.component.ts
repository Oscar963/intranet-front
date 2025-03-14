import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../interfaces/User';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../../../services/notification.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-index-user',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './index-user.component.html',
  styleUrl: './index-user.component.css',
})
export class IndexUserComponent implements OnInit {
  private userService = inject(UserService);
  private notificationService = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  public errorMessage: string = '';
  public successMessage: string | null = null;

  public users: User[] = [];
  public show: number = 15;
  public meta: any = {};
  public links: any = {};
  public loading: boolean = false;
  public currentPage: number = 1;

  public user: User = {
    id: 0,
    name: '',
    paternal_surname: '',
    maternal_surname: '',
    rut: '',
    email: '',
    status: 0,
  };

  public values = [
    { value: '15', label: '15' },
    { value: '50', label: '50' },
    { value: '100', label: '100' },
    { value: '500', label: '500' },
  ];

  form = new FormGroup({
    show: new FormControl(this.values[0]?.value),
  });

  ngOnInit() {
    this.authService.getUserObservable().subscribe({
      next: (user) => {
        this.user = user; 
        this.loading = false; 
      },
      error: (error) => {
        console.error('Error al obtener el usuario:', error);
        this.loading = false;
      },
    });

    // Escuchar mensajes de éxito y error
    this.notificationService.successMessage$.subscribe(
      (message) => (this.successMessage = message)
    );
    // Obtener el número de página desde la URL al inicializar el componente
    this.route.params.subscribe((params) => {
      const page = +params['page'] || 1;
      this.currentPage = page;
      this.loadUsers(this.currentPage, this.show);
    });
  }

  loadUsers(page: number, show: number): void {
    this.loading = true;

    this.userService.fetchUsers(page, show).subscribe({
      next: (response) => {
        this.users = response.data.data;
        this.meta = {
          current_page: response.data.meta.current_page,
          last_page: response.data.meta.last_page,
          from: response.data.meta.from,
          to: response.data.meta.to,
          total: response.data.meta.total,
          links: response.data.meta.links.map((link: any, index: number) => ({
            id: `link-${index}`, // Clave única generada para cada enlace
            label: link.label,
            page: this.extractPage(link.url),
            active: link.active,
          })),
        };
        this.links = {
          first: response.data.links.first,
          last: response.data.links.last,
          next: response.data.links.next,
          prev: response.data.links.prev,
        };
      },
      error: (error) => {
        console.error('Error al obtener los usuarios:', error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  goToPage(page: number | null): void {
    if (page && page > 0 && page <= this.meta.last_page) {
      this.router.navigate(['admin/users/page', page]);
    }
  }

  deleteItem(id: number) {
    Swal.fire({
      title: '¿Estás seguro que desea eliminar el usuario?',
      text: '¡Esta acción no podrá ser revertida!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#06048c',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonColor: '#d63939',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Eliminando...',
          html: 'Por favor, espera mientras se elimina el registro.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        this.userService.deleteUser(id).subscribe({
          next: (success: string) => {
            Swal.close();
            Swal.fire({
              title: '¡Eliminado!',
              text: success,
              icon: 'success',
              confirmButtonColor: '#06048c',
              confirmButtonText: 'Cerrar',
            });
            this.loadUsers(this.currentPage, this.show);
          },
          error: (error) => {
            Swal.close();
            Swal.fire({
              title: 'Error',
              text: error.message || 'No se pudo eliminar el registro.',
              icon: 'error',
              confirmButtonColor: '#d63939',
              confirmButtonText: 'Cerrar',
            });
          },
        });
      }
    });
  }

  onChange(e: any) {
    this.show = e.target.value;
    this.router.navigate(['admin/users/page', 1]);
    this.currentPage = 1
    this.loadUsers(this.currentPage, this.show);
  }

  private extractPage(url: string | null): number | null {
    if (!url) return null;
    const match = url.match(/page=(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }
}
