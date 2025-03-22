import { Component, inject, signal } from '@angular/core';
import { Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AnexoService } from '../../../../services/anexo.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../../../../services/toast.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Anexo } from '../../../../interfaces/Anexo';
import { take, tap } from 'rxjs';

@Component({
  selector: 'app-update-anexo',
  imports: [ReactiveFormsModule],
  templateUrl: './update-anexo.component.html',
  styleUrl: './update-anexo.component.css',
})
export class UpdateAnexoComponent {
  //Inyección de servicios usando la nueva API de Angular.
  private anexoService = inject(AnexoService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  // Variables de estado reactivas
  public loading = signal(false);
  public errorMessage = signal<string>('');
  public anexoId = signal<number>(
    Number(this.route.snapshot.paramMap.get('id')),
  );

  // Definición del formulario con validaciones
  form = this.fb.nonNullable.group({
    internal_number: ['', Validators.required],
    external_number: ['', Validators.required],
    office: '',
    unit: '',
    person: '',
  });
  
  //Cargando datos de objeto
  public anexoRs = rxResource<Anexo, void>({
    loader: () =>
      this.anexoService
        .getAnexoById(this.anexoId())
        .pipe(tap((response) => this.setData(response))),
  });

  //Maneja el envío del formulario.
  //Valida el formulario, construye los datos y los envía al backend.
  onSubmit(): void {
    if (!this.validateForm()) return;
    this.loading.set(true);
    this.clearMessages();

    const formData = this.buildFormData();

    this.anexoService
      .updateAnexo(this.anexoId(), formData)
      .pipe(take(1))
      .subscribe({
        next: (success: string) => this.handleSuccess(success),
        error: (error) => this.handleError(error),
        complete: () => this.loading.set(false),
      })
      .add(() => {
        this.loading.set(false);
      });
  }

  private setData(response: Anexo) {
    if (response) {
      this.form.patchValue({
        internal_number: response.internal_number.toString(),
        external_number: response.external_number.toString(),
        office: response.office || '',
        unit: response.unit || '',
        person: response.person || '',
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
    formData.append('internal_number', this.form.value.internal_number!);
    formData.append('external_number', this.form.value.external_number!);
    formData.append('office', this.form.value.office!);
    formData.append('unit', this.form.value.unit!);
    formData.append('person', this.form.value.person!);

    return formData;
  }

  // Maneja la respuesta exitosa del backend
  private handleSuccess(success: string): void {
    this.resetForm();
    this.toastService.success(success);
    this.router.navigate(['/admin/anexos']);
  }

  // Valida el formulario antes de enviarlo
  private validateForm(): boolean {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.errorMessage.set('Por favor, complete todos los campos requeridos.');
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
  }

  // Procesa los errores de validación del backend
  private processErrors(errors: { [key: string]: string[] }): string {
    const errorList = Object.keys(errors)
      .flatMap((key) => errors[key])
      .map((error) => `${error}</br>`)
      .join('');
    return `${errorList}`;
  }
}
