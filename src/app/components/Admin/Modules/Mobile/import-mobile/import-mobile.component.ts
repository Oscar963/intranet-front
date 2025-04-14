/** Componente para importar y exportar mobiles */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  computed,
  viewChild,
} from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Modal, Dropdown } from 'bootstrap';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';

import { MobileService } from '@services/mobile.service';
import { ToastService } from '@app/core/services/toast.service';

@Component({
  selector: 'app-import-mobile',
  templateUrl: './import-mobile.component.html',
  styleUrls: ['./import-mobile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportMobileComponent implements AfterViewInit {
  // Servicios inyectados
  private readonly mobileService = inject(MobileService);
  private readonly toastService = inject(ToastService);

  // Referencias al DOM
  public fileInput =
    viewChild.required<ElementRef<HTMLInputElement>>('fileInput');
  public dropdownButton = viewChild.required<ElementRef>('dropdownButton');
  public modalImport = viewChild.required<ElementRef>('modalImportRef');

  // Instancia del modal
  public modal = signal<Modal | null>(null);

  // Tipos de archivo válidos
  private readonly validFileTypes = new Set([
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ]);

  // Estado del componente
  public readonly state = signal({
    selectedFile: null as File | null,
    uploadProgress: 0,
    isUploading: false,
    loading: false,
    errorMessage: '',
  });

  // Computado: desactiva el botón de envío si no hay archivo o está cargando
  public readonly isSubmitDisabled = computed(
    () =>
      this.state().isUploading ||
      this.state().loading ||
      !this.state().selectedFile,
  );

  // Inicializa el modal una vez renderizado el componente
  public ngAfterViewInit(): void {
    this.setModal();
  }

  // Inicializa la instancia del modal Bootstrap
  private setModal(): void {
    const instance = new Modal(this.modalImport().nativeElement, {
      backdrop: 'static',
      keyboard: false,
    });
    this.modal.set(instance);
  }

  // Abre el modal, reinicia estado y oculta dropdown
  public openModal(event: Event): void {
    const target = event.target as HTMLElement;
    target.blur();
    this.toggleDropdown();
    this.resetState();
    this.modal()?.show();
  }

  // Cierra el modal
  public closeModal(): void {
    this.modal()?.hide();
  }

  // Alterna el estado del dropdown de opciones
  public toggleDropdown(): void {
    const instance = new Dropdown(this.dropdownButton().nativeElement);
    instance.toggle();
  }

  // Maneja la selección de archivo desde el input
  public onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (!file) {
      this.toastService.error('No se seleccionó ningún archivo');
      return;
    }

    if (!this.validFileTypes.has(file.type.toLowerCase())) {
      this.toastService.error('Formato no válido. Use archivos Excel o CSV');
      this.setState({ selectedFile: null });
      return;
    }

    this.setState({ selectedFile: file, errorMessage: '', uploadProgress: 0 });
    this.toastService.info('Archivo seleccionado correctamente');
  }

  // Envía el archivo seleccionado si es válido
  public onSubmit(): void {
    if (!this.state().selectedFile) {
      this.toastService.error('Seleccione un archivo antes de continuar');
      return;
    }
    this.confirmImport();
  }

  // Exporta los mobiles existentes en un archivo descargable
  public exportMobiles(): void {
    this.toggleDropdown();
    this.setState({ loading: true });

    this.mobileService.exportMobiles().subscribe({
      next: (blob: Blob) => {
        const fileName = `moviles_${new Date().toISOString().slice(0, 10)}.xlsx`;
        saveAs(blob, fileName);
        this.toastService.success('Exportación completada con éxito');
      },
      error: (err) => {
        const message = err?.error?.message ?? 'Error al exportar los datos';
        this.toastService.error(message);
      },
      complete: () => this.setState({ loading: false }),
    });
  }

  // Muestra confirmación de usuario antes de realizar la importación
  private confirmImport(): void {
    Swal.fire({
      title: 'Confirmar Importación',
      text: 'Esta acción reemplazará todos los moviles existentes. ¿Desea continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, importar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) this.uploadFile();
    });
  }

  // Envía el archivo al backend y realiza seguimiento del progreso
  private uploadFile(): void {
    const file = this.state().selectedFile;
    if (!file) return;

    this.setState({
      isUploading: true,
      loading: true,
      uploadProgress: 0,
      errorMessage: '',
    });

    this.showProgressAlert();

    this.mobileService.uploadMobiles(file).subscribe({
      next: (event) => this.trackUploadProgress(event),
      error: (error) => this.handleUploadError(error),
      complete: () => {
        this.setState({ isUploading: false, loading: false });
        this.showSuccessAlert();
      },
    });
  }

  // Muestra una alerta de progreso durante la carga
  private showProgressAlert(): void {
    Swal.fire({
      title: 'Subiendo...',
      text: 'Espere mientras se carga el archivo',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  // Muestra una alerta de éxito al finalizar la carga
  private showSuccessAlert(): void {
    Swal.fire({
      title: '¡Importación completada!',
      text: 'Los moviles fueron importados correctamente.',
      icon: 'success',
      confirmButtonColor: '#06048c',
      confirmButtonText: 'Cerrar',
    }).then(() => {
      this.resetState();
      this.closeModal();
    });
  }

  // Muestra un error si falla la carga del archivo
  private handleUploadError(error: any): void {
    const errorMessage = error ?? 'Error durante la importación';
    this.setState({
      errorMessage,
      isUploading: false,
      loading: false,
      uploadProgress: 0,
    });
    this.toastService.error(errorMessage);
    Swal.close();
  }

  // Actualiza el progreso de la carga en base al evento HTTP
  private trackUploadProgress(event: HttpEvent<any>): void {
    if (event.type === HttpEventType.UploadProgress && event.total) {
      const progress = Math.round((100 * event.loaded) / event.total);
      this.setState({ uploadProgress: progress });
    }
  }

  // Reinicia el estado interno del componente
  private resetState(): void {
    this.setState({
      selectedFile: null,
      uploadProgress: 0,
      isUploading: false,
      loading: false,
      errorMessage: '',
    });
    this.fileInput().nativeElement.value = '';
  }

  // Actualiza el estado del componente
  private setState(newState: Partial<ReturnType<typeof this.state>>): void {
    this.state.set({ ...this.state(), ...newState });
  }
}
