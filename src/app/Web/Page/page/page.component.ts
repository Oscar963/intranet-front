import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebService } from '../../../services/web.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Page } from '../../../interfaces/Page';
import Swal from 'sweetalert2';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { FileService } from '../../../services/file.service';

@Component({
  selector: 'app-page',
  imports: [ReactiveFormsModule],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css',
})
export class PageComponent {
  private webService = inject(WebService);
  private route = inject(ActivatedRoute);
  private fileService = inject(FileService);

  public page: Page = {
    id: 0,
    title: '',
    content: '',
    image: '',
    date: '',
    slug: '',
    status: '',
    files: [],
    created_at: '',
    updated_at: '',
    deleted_at: null,
    created_by: {
      name: '',
      email: '',
      paternal_surname: '',
      maternal_surname: '',
    },
    updated_by: {
      name: '',
      email: '',
      paternal_surname: '',
      maternal_surname: '',
    },
    deleted_by: null,
  };

  public slug!: string;
  public loading: boolean = false;
  public bannerId!: number; // ID del banner a actualizar

  form = new FormGroup({
    query: new FormControl(''),
    show: new FormControl(15),
  });

  ngOnInit() {
    // Obtener el ID del banner desde la URL
    this.slug = this.route.snapshot.paramMap.get('slug')?.toString() || '';
    this.loadPage();
  }

  loadPage(): void {
    this.loading = true;
    this.webService.getPageBySlug(this.slug).subscribe({
      next: (response) => {
        this.page = response;
        console.log(this.page.files);
      },
      error: (error) => {
        console.error('Error al cargar la página:', error);
      },
      complete: () => {
        this.loading = false;
      },
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
}
