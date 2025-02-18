import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  public loading: boolean = false;
  public errorMessage: string = '';
  public successMessage: string = '';

  form: FormGroup = new FormGroup({
    email: new FormControl('oscar.apata01@gmail.com', [
      Validators.required,
      Validators.email,
    ]),
  });

  constructor(private authService: AuthService) {}

  forgotPassword(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.forgotPassword(this.form.value.email).subscribe({
      next: (response: string) => {
        this.loading = false;
        this.successMessage = response;
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 422) {
          this.errorMessage = this.processErrors(error.error.errors);
        } else {
          this.errorMessage = error;
        }
      },
    });
  }

  processErrors(errors: { [key: string]: string[] }): string {
    const errorList = Object.keys(errors)
      .flatMap((key) => errors[key])
      .map((error) => `- ${error}</br>`)
      .join('');

    return `${errorList}`;
  }
}
