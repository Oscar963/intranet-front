import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  public isLoading = signal(false);

  showLoading() {
    this.isLoading.set(true);
  }

  hideLoading() {
    this.isLoading.set(false);
  }
}
