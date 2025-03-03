import { Component, inject, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { FileService } from '../../../../services/file.service';
import { NotificationService } from '../../../../services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadSimpleFileComponent } from '../../../../Utils/upload-simple-file/upload-simple-file.component';

@Component({
  selector: 'app-store-file',
  imports: [UploadSimpleFileComponent, ReactiveFormsModule],
  templateUrl: './store-file.component.html',
  styleUrl: './store-file.component.css',
})
export class StoreFileComponent {
  @ViewChild(UploadSimpleFileComponent)
  UploadSimpleFile!: UploadSimpleFileComponent;

  private fileService = inject(FileService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public loading: boolean = false;
  public errorMessage: string = '';
  public successMessage: string = '';
  public showPassword: boolean = false;
  public pageId!: number; // ID del page a actualizar

  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });

  ngOnInit(): void {
    // Obtener el ID del page desde la URL
    this.pageId = Number(this.route.snapshot.paramMap.get('idpage'));
  }

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.form.markAllAsTouched();

    // Verificar si el formulario es válido antes de enviarlo
    if (this.form.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos requeridos.';
      this.loading = false;
      window.scroll(0, 0);
      return;
    }

    const formData = new FormData();
    formData.append('name', this.form.value.name);
    formData.append('description', this.form.value.description);
    formData.append('page_id', this.pageId.toString());

    // Obtener el archivo desde Dropzone
    const file = this.UploadSimpleFile.getFile();
    if (file) {
      formData.append('file', file);
    } else {
      //   console.error('No hay image seleccionada');
    }

    this.fileService
      .storeFiles(formData)
      .subscribe({
        next: (success: string) => {
          this.form.reset();
          this.UploadSimpleFile.removeAllFiles();
          this.notificationService.showSuccess(success); // Mostrar mensaje de éxito
          this.router.navigate(['/admin/files/' + this.pageId]);
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
