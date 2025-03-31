import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { UploadSimpleImgComponent } from '@shared/upload-simple-img/upload-simple-img.component';
import { Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import dayjs from 'dayjs/esm';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { PopupService } from '@services/popup.service';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '@services/toast.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { take, tap } from 'rxjs';
import { Popup } from '@interfaces/Popup';

@Component({
  selector: 'app-update-popup',
  imports: [UploadSimpleImgComponent, ReactiveFormsModule, BsDatepickerModule],
  templateUrl: './update-popup.component.html',
  styleUrl: './update-popup.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePopupComponent {
  // Referencia al componente de subida de imágenes.
  // Se usa para obtener la imagen seleccionada.
  @ViewChild(UploadSimpleImgComponent)
  UploadSimpleImg!: UploadSimpleImgComponent;

  //Inyección de servicios usando la nueva API de Angular.
  private popupService = inject(PopupService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  // Variables de estado reactivas
  public loading = signal(false);
  public errorMessage = signal<string>('');
  public popupId = signal<number>(
    Number(this.route.snapshot.paramMap.get('id')),
  );

  constructor(private bsLocaleService: BsLocaleService) {
    // Configura el idioma del datepicker
    defineLocale('es', esLocale);
    this.bsLocaleService.use('es');
    dayjs.extend(customParseFormat);
  }

  // Definición del formulario con validaciones
  form = this.fb.group({
    title: ['', Validators.required],
    date_expiration: ['', Validators.required],
    status: ['', Validators.required],
    link: '',
  });

  //Cargando datos de objeto
  popupRs = rxResource<Popup, void>({
    loader: () =>
      this.popupService
        .getPopupById(this.popupId())
        .pipe(tap((response) => this.setData(response))),
  });

  //Maneja el envío del formulario.
  //Valida el formulario, construye los datos y los envía al backend.
  onSubmit(): void {
    if (!this.validateForm()) return;
    this.loading.set(true);
    this.clearMessages();

    const formData = this.buildFormData();

    this.popupService
      .updatePopup(this.popupId(), formData)
      .pipe(take(1))
      .subscribe({
        next: (success: string) => this.handleSuccess(success),
                error: (error) => {
          this.loading.set(false);
          this.handleError(error);
        },
        complete: () => this.loading.set(false),
      })
      .add(() => {
        this.loading.set(false);
      });
  }

  private setData(response: Popup) {
    if (response) {
      this.form.patchValue({
        title: response.title,
        date_expiration: response.date_expiration,
        status: response.status,
        link: response.link || '',
      });
    }
  }

  private clearMessages(): void {
    this.errorMessage.set('');
  }

  // Construye los datos a enviar en `FormData`
  private buildFormData(): FormData {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('title', this.form.value.title!);
    formData.append(
      'date_expiration',
      this.formatDate(this.form.value.date_expiration),
    );

    formData.append('status', this.form.value.status!);
    formData.append('link', this.form.value.link!);

    // Agregar la imagen si está disponible
    const image = this.UploadSimpleImg.getFile();
    if (image) formData.append('image', image);

    return formData;
  }

  // Maneja la respuesta exitosa del backend
  private handleSuccess(success: string): void {
    this.resetForm();
    this.toastService.success(success);
    this.router.navigate(['/admin/popups']);
  }

  // Valida el formulario antes de enviarlo
  private validateForm(): boolean {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.errorMessage.set('Por favor, complete todos los campos requeridos.');
      window.scroll(0, 0);
      return false;
    }
    return true;
  }

  // Maneja los errores del backend
  private handleError(error: any): void {
    if (error.status === 422) {
      this.errorMessage.set(this.processErrors(error.error.errors));
      window.scroll(0, 0);
    } else {
      this.errorMessage.set(error);
    }
  }

  // Reinicia el formulario y limpia los archivos
  private resetForm(): void {
    this.form.reset();
    this.UploadSimpleImg.removeAllFiles();
  }

  // Procesa los errores de validación del backend
  private processErrors(errors: { [key: string]: string[] }): string {
    const errorList = Object.keys(errors)
      .flatMap((key) => errors[key])
      .map((error) => `${error}</br>`)
      .join('');
    return `${errorList}`;
  }

  // Formatea la fecha para el backend
  public formatDate(date: any): string {
    if (
      typeof date === 'string' &&
      dayjs(date, 'DD-MM-YYYY HH:mm:ss', true).isValid()
    ) {
      // Si la fecha es un string con formato 'DD-MM-YYYY HH:mm:ss', convertir a 'YYYY-MM-DD HH:mm'
      return dayjs(date, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm');
    }

    // Si la fecha es un objeto Date o una fecha en formato largo, convertirla directamente
    const fechaParseada = dayjs(date);
    if (fechaParseada.isValid()) {
      return fechaParseada.format('YYYY-MM-DD HH:mm');
    }

    return 'Formato de fecha no válido';
  }
}
