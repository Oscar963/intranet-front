import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FileService } from '../../../../services/file.service';
import { File } from '../../../../interfaces/File';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../../../services/notification.service';
import Swal from 'sweetalert2';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { PageService } from '../../../../services/page.service';

@Component({
  selector: 'app-file-index-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './file-index-page.component.html',
  styleUrl: './file-index-page.component.css',
})
export class FileIndexPageComponent implements OnInit {
  private fileService = inject(FileService);
  private pageService = inject(PageService);

  private notificationService = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public errorMessage: string = '';
  public successMessage: string | null = null;
  public files: File[] = [];
  public show: number = 15;
  public meta: any = {};
  public links: any = {};
  public loading: boolean = false;
  public currentPage: number = 1;
  public pageId!: number;

  values = [
    { value: '15', label: '15' },
    { value: '50', label: '50' },
    { value: '100', label: '100' },
    { value: '500', label: '500' },
  ];

  form = new FormGroup({
    show: new FormControl(this.values[0]?.value),
  });

  ngOnInit(): void {
    this.pageId = Number(this.route.snapshot.paramMap.get('idpage'));

    this.notificationService.successMessage$.subscribe(
      (message) => (this.successMessage = message),
    );

    this.route.params.subscribe((params) => {
      const page = +params['page'] || 1;
      this.currentPage = page;
      this.loadFiles(this.currentPage, this.show);
    });
  }

  loadFiles(page: number, show: number): void {
    this.loading = true;

    this.pageService.fetchFile(page, show).subscribe({
      next: (response) => {
        this.files = response.data.data;
        this.meta = { ...response.data.meta };

        this.links = {
          first: response.data.links.first,
          last: response.data.links.last,
          next: response.data.links.next,
          prev: response.data.links.prev,
        };

        this.meta.links = response.data.meta.links.map(
          (link: any, index: number) => ({
            id: `link-${index}`,
            label: link.label,
            page: this.extractPage(link.url),
            active: link.active,
          }),
        );
      },
      error: (error) => {
        console.error('Error al obtener los files:', error);
        this.errorMessage = error.message || 'Error al cargar los archivos.';
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  goToPage(page: number | null): void {
    if (page && page > 0 && page <= this.meta.last_page) {
      this.router.navigate(['admin/pages/files/page', page]);
    }
  }

  deleteItem(id: number) {
    Swal.fire({
      title: '¿Estás seguro que desea eliminar el archivo?',
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

        this.fileService.deleteFile(id).subscribe({
          next: (success: string) => {
            Swal.close();
            Swal.fire({
              title: '¡Eliminado!',
              text: success,
              icon: 'success',
              confirmButtonColor: '#06048c',
              confirmButtonText: 'Cerrar',
            });
            this.loadFiles(this.currentPage, this.show);
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
    this.router.navigate(['admin/pages/files/page', 1]);
    this.currentPage = 1;
    this.loadFiles(this.currentPage, this.show);
  }

  extractPage(url: string | null): number | null {
    return url
      ? parseInt(url.match(/page=(\d+)/)?.[1] || '', 10) || null
      : null;
  }

  downloadFile(fileId: number, fileName: string) {
    Swal.fire({
      title: 'Descargando...',
      html: 'Por favor, espera mientras se descarga el archivo.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.fileService.downloadFile(fileId).subscribe({
      next: (response: HttpResponse<Blob>) => {
        Swal.close();

        const headers = response.headers;
        const fileExtension = this.getFileExtension(headers, fileName);
        const url = window.URL.createObjectURL(response.body!);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileExtension);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        Swal.fire({
          title: '¡Listo!',
          text: 'Archivo descargado',
          icon: 'success',
          confirmButtonColor: '#06048c',
          confirmButtonText: 'Cerrar',
        });
      },
      error: (error) => {
        Swal.close();
        console.error('Error descargando archivo:', error);

        let errorMessage = 'No se pudo descargar el archivo.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        Swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error',
          confirmButtonColor: '#d63939',
          confirmButtonText: 'Cerrar',
        });
      },
    });
  }

  private getFileExtension(headers: HttpHeaders, fileName: string): string {
    let fileExtension = fileName.substring(fileName.lastIndexOf('.'));
    if (!fileExtension) {
      const contentType = headers.get('Content-Type');
      if (contentType) {
        if (contentType.startsWith('image/')) {
          fileExtension = '.jpg';
        } else if (contentType.startsWith('application/pdf')) {
          fileExtension = '.pdf';
        } // Puedes añadir más tipos de contenido aquí
      }
    }
    return fileExtension;
  }

  getFileImage(fileType: string): string {
    switch (fileType) {
      case 'PDF':
        return '/assets/icons/files/pdf.png'; // Ruta a tu imagen PDF
      case 'Word':
        return '/assets/icons/files/doc.png'; // Ruta a tu imagen Word
      case 'Excel':
        return '/assets/icons/files/xls.png'; // Ruta a tu imagen Excel
      case 'PowerPoint':
        return '/assets/icons/files/ppt.png'; // Ruta a tu imagen PowerPoint
      case 'Video MP4':
        return '/assets/icons/files/mp4.png'; // Ruta a tu imagen de video
      case 'Imagen JPEG':
      case 'Imagen JPG':
        return '/assets/icons/files/jpg-file.png'; // Icono JPEG
      case 'Imagen PNG':
        return '/assets/icons/files/png.png'; // Icono PNG
      case 'Imagen GIF':
        return '/assets/icons/files/gif.png'; // Icono GIF
      case 'Archivo ZIP':
        return '/assets/icons/files/zip.png'; // Ruta a tu imagen ZIP
      default:
        return '/assets/icons/files/failure.png'; // Ruta a tu imagen para tipo desconocido
    }
  }
}
