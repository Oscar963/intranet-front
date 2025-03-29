import { Component, ElementRef, ViewChild } from '@angular/core';
import Dropzone from 'dropzone';
import 'dropzone/dist/dropzone.css';

@Component({
  selector: 'app-upload-simple-img',
  imports: [],
  templateUrl: './upload-simple-img.component.html',
  styleUrl: './upload-simple-img.component.css',
})
export class UploadSimpleImgComponent {
  @ViewChild('UploadSimpleImg') UploadSimpleImg!: ElementRef<HTMLFormElement>;
  private dropzoneInstance!: Dropzone;

  ngAfterViewInit(): void {
    this.initializeDropzone();
  }

  private initializeDropzone(): void {
    this.dropzoneInstance = new Dropzone(this.UploadSimpleImg.nativeElement, {
      url: '/upload', // Solo para inicializar Dropzone, no se usa para subir automáticamente.
      maxFiles: 1,
      maxFilesize: 2, // En MB
      acceptedFiles: '.jpg,.png,.jpeg,.webp',
      addRemoveLinks: true, // Mostrar enlace para eliminar archivo
      autoProcessQueue: false, // No subir automáticamente
      uploadMultiple: false,
      dictDefaultMessage: 'Arrastra y suelta tu imagen aquí o haz clic',
      dictFallbackMessage:
        'Tu navegador no soporta la subida de archivos mediante arrastrar y soltar.',
      dictFileTooBig:
        'El archivo es demasiado grande ({{filesize}}MiB). Máximo permitido: {{maxFilesize}}MiB.',
      dictInvalidFileType: 'No puedes subir archivos de este tipo.',
      dictResponseError: 'El servidor respondió con el código {{statusCode}}.',
      dictCancelUpload: 'Cancelar subida',
      dictCancelUploadConfirmation:
        '¿Estás seguro de que quieres cancelar esta subida?',
      dictRemoveFile: 'Eliminar archivo',
      dictMaxFilesExceeded: 'No puedes subir más archivos.',
    });

    // Escuchar eventos
    this.dropzoneInstance.on('addedfile', (file) => {
      //     console.log(`Archivo añadido: ${file.name}`);
    });

    this.dropzoneInstance.on('removedfile', (file) => {
      //   console.log(`Archivo eliminado: ${file.name}`);
    });
  }

  // Exponer el archivo seleccionado
  public getFile(): File | null {
    const acceptedFiles = this.dropzoneInstance.getAcceptedFiles();
    return acceptedFiles.length > 0 ? acceptedFiles[0] : null;
  }

  // Eliminar todos los archivos del Dropzone
  public removeAllFiles(): void {
    this.dropzoneInstance.removeAllFiles();
  }
}
