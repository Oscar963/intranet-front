/** Componente modal para buscar archivos */
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { WebService } from '@app/core/services/web.service';
import { map, of } from 'rxjs';
import Swal from 'sweetalert2';
import { File } from '@interfaces/File';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-modal-search-file',
  imports: [],
  templateUrl: './modal-search-file.component.html',
  styleUrl: './modal-search-file.component.css',
})
export class ModalSearchFileComponent implements AfterViewInit {
  // Servicio inyectado
  private readonly webService = inject(WebService);

  // Referencia al modal
  public modalSearchFile = viewChild.required<ElementRef>('modalSearchFileRef');
  public modal = signal<Modal | null>(null);

  // Referencia al input de búsqueda
  public txtName = viewChild.required<ElementRef>('txtNameRef');

  // Estado de entrada y errores
  public name = signal<string>('');
  public errorMessage = signal<string>('');

  // Recurso reactivo para búsqueda de archivos
  public filesLoader = rxResource<File[], { name: string }>({
    request: () => ({ name: this.name() }),
    loader: ({ request }) => {
      if (!request.name.trim()) {
        return of([]);
      }
      return this.webService
        .searchFiles(request.name)
        .pipe(map((response) => response as File[]));
    },
  });

  // Inicializa el modal después de renderizar la vista
  ngAfterViewInit(): void {
    this.setModal();
  }

  // Configura la instancia del modal
  private setModal(): void {
    const modalInstance = new Modal(this.modalSearchFile().nativeElement);
    this.modal.set(modalInstance);
  }

  // Abre el modal y reinicia el estado
  public openModal(): void {
    this.resetModalState();
    this.modal()?.show();
  }

  // Cierra el modal
  public closeModal(): void {
    this.modal()?.hide();
  }

  // Reinicia variables del modal al abrirlo
  private resetModalState(): void {
    this.name.set('');
    this.errorMessage.set('');
    this.filesLoader.reload();
    if (this.txtName()) {
      this.txtName().nativeElement.value = ''; 
    }
  }

  // Retorna el icono correspondiente al tipo de archivo
  public getFileImage(fileType: string): string {
    const iconMap: { [key: string]: string } = {
      PDF: '/assets/icons/files/pdf.png',
      Word: '/assets/icons/files/doc.png',
      Excel: '/assets/icons/files/xls.png',
      PowerPoint: '/assets/icons/files/ppt.png',
      'Video MP4': '/assets/icons/files/mp4.png',
      'Imagen JPEG': '/assets/icons/files/jpg-file.png',
      'Imagen JPG': '/assets/icons/files/jpg-file.png',
      'Imagen PNG': '/assets/icons/files/png.png',
      'Imagen GIF': '/assets/icons/files/gif.png',
      'Archivo ZIP': '/assets/icons/files/zip.png',
    };

    return iconMap[fileType] || '/assets/icons/files/failure.png';
  }

  // Descarga un archivo dado su ID
  public downloadFile(fileId: number, fileName: string): void {
    Swal.fire({
      title: 'Descargando...',
      html: 'Por favor, espera mientras se descarga el archivo.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    this.webService.downloadFile(fileId).subscribe({
      next: (response: HttpResponse<Blob>) => {
        Swal.close();

        const headers = response.headers;
        const fileExtension = this.getFileExtension(headers, fileName);
        const blobUrl = window.URL.createObjectURL(response.body!);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', fileExtension);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(blobUrl);

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
        this.showDownloadError(error);
      },
    });
  }

  // Obtiene la extensión del archivo desde headers o nombre
  private getFileExtension(headers: HttpHeaders, fileName: string): string {
    let fileExtension = fileName.substring(fileName.lastIndexOf('.'));
    if (!fileExtension) {
      const contentType = headers.get('Content-Type');
      if (contentType?.startsWith('image/')) return '.jpg';
      if (contentType?.includes('pdf')) return '.pdf';
    }
    return fileExtension;
  }

  // Muestra un mensaje de error si falla la descarga
  private showDownloadError(error: any): void {
    let message = 'No se pudo descargar el archivo.';
    if (error.error?.message) {
      message = error.error.message;
    } else if (error.message) {
      message = error.message;
    }

    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonColor: '#d63939',
      confirmButtonText: 'Cerrar',
    });
  }
}
