import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private successMessageSubject = new BehaviorSubject<string | null>(null);
  private errorMessageSubject = new BehaviorSubject<string | null>(null);

  successMessage$ = this.successMessageSubject.asObservable();
  errorMessage$ = this.errorMessageSubject.asObservable();

  showSuccess(message: string): void {
    this.successMessageSubject.next(message);
    setTimeout(() => this.clearSuccess(), 10000); // Limpiar después de 3 segundos
  }

  showError(message: string): void {
    this.errorMessageSubject.next(message);
    setTimeout(() => this.clearError(), 10000); // Limpiar después de 3 segundos
  }

  clearSuccess(): void {
    this.successMessageSubject.next(null);
  }

  clearError(): void {
    this.errorMessageSubject.next(null);
  }
}
