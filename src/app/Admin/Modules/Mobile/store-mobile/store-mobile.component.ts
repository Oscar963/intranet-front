import { Component, inject, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { MobileService } from '../../../../services/mobile.service';
import { NotificationService } from '../../../../services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store-mobile',
  imports: [ReactiveFormsModule],
  templateUrl: './store-mobile.component.html',
  styleUrl: './store-mobile.component.css',
})
export class StoreMobileComponent {
  private mobileService = inject(MobileService);
  private notificationService = inject(NotificationService);
  public router = inject(Router);

  constructor() {}

  public loading: boolean = false;
  public errorMessage: string = '';
  public successMessage: string = '';

  form: FormGroup = new FormGroup({
    number: new FormControl('', [Validators.required]),
    office: new FormControl(''),
    direction: new FormControl(''),
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
    formData.append('number', this.form.value.number);
    formData.append('office', this.form.value.office);
    formData.append('direction', this.form.value.direction);
    formData.append('person', this.form.value.person);

    this.mobileService
      .storeMobile(formData)
      .subscribe({
        next: (success: string) => {
          this.form.reset();
          this.notificationService.showSuccess(success); // Mostrar mensaje de éxito
          this.router.navigate(['/admin/mobiles']);
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
