import { Component, inject, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { MobileService } from '../../../../services/mobile.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../../services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-mobile',
  imports: [ReactiveFormsModule],
  templateUrl: './update-mobile.component.html',
  styleUrl: './update-mobile.component.css',
})
export class UpdateMobileComponent {
  private mobileService = inject(MobileService);
  private notificationService = inject(NotificationService);
  public router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {}

  public loading: boolean = false;
  public errorMessage: string = '';
  public successMessage: string = '';
  public mobileId!: number; // ID del mobile a actualizar

  form: FormGroup = new FormGroup({
    number: new FormControl('', [Validators.required]),
    office: new FormControl(''),
    direction: new FormControl(''),
    person: new FormControl(''),
  });

  ngOnInit(): void {
    // Obtener el ID del mobile desde la URL
    this.mobileId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadMobileData();
  }

  // Cargar datos del mobile existente
  private loadMobileData(): void {
    this.loading = true;
    this.mobileService.getMobileById(this.mobileId).subscribe({
      next: (mobile) => {
        this.form.patchValue({
          number: mobile.number,
          office: mobile.office,
          direction: mobile.direction,
          person: mobile.person,
        });
      },
      error: (error) => {
        this.errorMessage = 'No se pudieron cargar los datos del mobile.';
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos requeridos.';
      this.loading = false;
      return;
    }

    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('number', this.form.value.number);
    formData.append('office', this.form.value.office);
    formData.append('direction', this.form.value.direction);
    formData.append('person', this.form.value.person);

    // Llamar al servicio de actualización
    this.mobileService
      .updateMobile(this.mobileId, formData)
      .subscribe({
        next: (success: string) => {
          this.notificationService.showSuccess(success); // Mostrar mensaje de éxito
          this.router.navigate(['/admin/mobiles']);
        },
        error: (error) => {
          if (error.status === 422) {
            this.errorMessage = this.processErrors(error.error.errors);
          } else {
            this.errorMessage = error;
          }
          window.scroll(0, 0);
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
