import { Component, inject, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { AnexoService } from '../../../../core/services/anexo.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-anexo',
  imports: [ReactiveFormsModule],
  templateUrl: './update-anexo.component.html',
  styleUrl: './update-anexo.component.css',
})
export class UpdateAnexoComponent {
  private anexoService = inject(AnexoService);
  private notificationService = inject(NotificationService);
  public router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {}

  public loading: boolean = false;
  public errorMessage: string = '';
  public successMessage: string = '';
  public anexoId!: number; // ID del anexo a actualizar

  form: FormGroup = new FormGroup({
    internal_number: new FormControl('', [Validators.required]),
    external_number: new FormControl('', [Validators.required]),
    office: new FormControl(''),
    unit: new FormControl(''),
    person: new FormControl(''),
  });

  ngOnInit(): void {
    // Obtener el ID del anexo desde la URL
    this.anexoId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAnexoData();
  }

  // Cargar datos del anexo existente
  private loadAnexoData(): void {
    this.loading = true;
    this.anexoService.getAnexoById(this.anexoId).subscribe({
      next: (anexo) => {
        this.form.patchValue({
          internal_number: anexo.internal_number,
          external_number: anexo.external_number,
          office: anexo.office,
          unit: anexo.unit,
          person: anexo.person,
        });
      },
      error: (error) => {
        this.errorMessage = 'No se pudieron cargar los datos del anexo.';
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
    formData.append('internal_number', this.form.value.internal_number);
    formData.append('external_number', this.form.value.external_number);
    formData.append('office', this.form.value.office);
    formData.append('unit', this.form.value.unit);
    formData.append('person', this.form.value.person);

    // Llamar al servicio de actualización
    this.anexoService
      .updateAnexo(this.anexoId, formData)
      .subscribe({
        next: (success: string) => {
          this.notificationService.showSuccess(success); // Mostrar mensaje de éxito
          this.router.navigate(['/admin/anexos']);
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
