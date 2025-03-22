import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FileService } from '../../../../services/file.service';
import { File } from '../../../../interfaces/File';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-index-file',
  imports: [RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './index-file.component.html',
  styleUrls: ['./index-file.component.css'],
})
export class IndexFileComponent {
  private fileService = inject(FileService);
  private toastService = inject(ToastService);

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public show = signal<number>(50);
  public meta = signal<any>({});
  public page = signal<number>(1);

  values = [
    { value: '15', label: '15' },
    { value: '50', label: '50' },
    { value: '100', label: '100' },
    { value: '500', label: '500' },
  ];

  constructor() {
    // Efecto para sincronizar `page` con la URL
    effect(() => {
      this.route.params.subscribe((params) => {
        this.page.set(+params['page'] || 1);
      });
    });
  }

  public filesRs = rxResource<File[], { page: number; show: number }>({
    request: () => ({
      page: this.page(),
      show: this.show(),
    }),
    loader: ({ request }) => {
      return this.fileService.fetchFile(request.page, request.show).pipe(
        switchMap((response) => {
          this.meta.set({
            current_page: response.meta?.current_page ?? 1,
            last_page: response.meta?.last_page ?? 1,
            from: response.meta?.from ?? 0,
            to: response.meta?.to ?? 0,
            total: response.meta?.total ?? 0,
            links:
              response.meta?.links?.map((link: any, index: number) => ({
                id: `link-${index}`,
                label: link.label ?? '',
                page: this.extractPage(link.url) ?? null,
                active: link.active ?? false,
              })) ?? [],
          });

          return [response.data.data];
        }),
      );
    },
  });

  public deleteItem(id: number) {
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
            this.filesRs.reload();
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

  public goToPage(page: number | null): void {
    if (page && page > 0 && page <= this.meta().last_page) {
      this.router.navigate(['admin/files/page', page]);
    }
  }

  private extractPage(url: string | null): number | null {
    return url
      ? parseInt(url.match(/page=(\d+)/)?.[1] || '', 10) || null
      : null;
  }

  public downloadFile(fileId: number, fileName: string) {
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

  public copyToClipboard(text: string): void {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        this.toastService.info('URL copiada al portapapeles.');
      })
      .catch((err) => {
        this.toastService.error('Error al copiar al portapapeles', err);
      });
  }

  public getFileImage(fileType: string): string {
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
