import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AnexoService } from '@services/anexo.service';
import { Router } from '@angular/router';
import { ToastService } from '@services/toast.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-store-anexo',
  imports: [ReactiveFormsModule],
  templateUrl: './store-anexo.component.html',
  styleUrl: './store-anexo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreAnexoComponent {
  //Inyección de servicios usando la nueva API de Angular.
  private anexoService = inject(AnexoService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // Variables de estado reactivas
  public loading = signal(false);
  public errorMessage = signal<string>('');

  // Definición del formulario con validaciones
  form = this.fb.group({
    internal_number: ['', Validators.required],
    external_number: ['', Validators.required],
    office: '',
    unit: '',
    person: '',
  });

  //Maneja el envío del formulario.
  //Valida el formulario, construye los datos y los envía al backend.
  onSubmit(): void {
    if (!this.validateForm()) return;
    this.loading.set(true);
    this.clearMessages();

    const formData = this.buildFormData();

    this.anexoService
      .storeAnexo(formData)
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

  // Limpia los mensajes de error y éxito
  private clearMessages(): void {
    this.errorMessage.set('');
  }

  // Construye los datos a enviar en `FormData`
  private buildFormData(): FormData {
    const formData = new FormData();
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
