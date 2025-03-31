import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { WebService } from '@services/web.service';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { File } from '@interfaces/File';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private webService = inject(WebService);

  public menuItems = signal([
    { icon: '', title: 'Inicio' },
    { icon: 'anexos', title: 'Anexos' },
    { icon: 'mobiles', title: 'Celulares' },
    { icon: 'contact', title: 'Contacto' },
  ]);

  public files: File[] = [];
  public loading: boolean = false;
  public errorMessage: string = '';
  public successMessage: string = '';

  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });


  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.form.markAllAsTouched();

    // Verificar si el formulario es válido antes de enviarlo
    if (this.form.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos requeridos.';
      this.loading = false;
      return;
    }

    this.webService
      .searchFiles(this.form.value.name)
      .subscribe({
        next: (response) => {
          if (!response || response.length === 0) {
            this.successMessage = 'No se encontraron resultados';
            this.files = [];
          } else {
            this.files = response;
            this.successMessage = ''; // Limpiar mensaje si hay resultados
          }
        },
      })
      .add(() => {
        this.loading = false;
      });
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

  downloadFile(fileId: number, fileName: string) {
    Swal.fire({
      title: 'Descargando...',
      html: 'Por favor, espera mientras se descarga el archivo.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.webService.downloadFile(fileId).subscribe({
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

  getFileExtension(headers: HttpHeaders, fileName: string): string {
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
}
