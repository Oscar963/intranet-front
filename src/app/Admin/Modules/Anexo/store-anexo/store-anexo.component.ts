import { Component, inject, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { AnexoService } from '../../../../services/anexo.service';
import { NotificationService } from '../../../../services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store-anexo',
  imports: [ReactiveFormsModule],
  templateUrl: './store-anexo.component.html',
  styleUrl: './store-anexo.component.css',
})
export class StoreAnexoComponent {
  private anexoService = inject(AnexoService);
  private notificationService = inject(NotificationService);
  public router = inject(Router);

  constructor() {}

  public loading: boolean = false;
  public errorMessage: string = '';
  public successMessage: string = '';

  form: FormGroup = new FormGroup({
    internal_number: new FormControl('', [Validators.required]),
    external_number: new FormControl('', [Validators.required]),
    office: new FormControl(''),
    unit: new FormControl(''),
    person: new FormControl(''),
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

    const formData = new FormData();
    formData.append('internal_number', this.form.value.internal_number);
    formData.append('external_number', this.form.value.external_number);
    formData.append('office', this.form.value.office);
    formData.append('unit', this.form.value.unit);
    formData.append('person', this.form.value.person);

    this.anexoService
      .storeAnexo(formData)
      .subscribe({
        next: (success: string) => {
          this.form.reset();
          this.notificationService.showSuccess(success); // Mostrar mensaje de éxito
          this.router.navigate(['/admin/anexos']);
        },
        error: (error) => {
          if (error.status === 422) {
            this.errorMessage = this.processErrors(error.error.errors);
            window.scroll(0, 0);
          } else {
            this.errorMessage = error;
          }
        },
      })
      .add(() => {
        this.loading = false;
      });
  }

  processErrors(errors: { [key: string]: string[] }): string {
    const errorList = Object.keys(errors)
      .flatMap((key) => errors[key])
      .map((error) => `${error}</br>`)
      .join('');
    return `${errorList}`;
  }
}
