import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationService } from '@services/notification.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private notificationService = inject(NotificationService);
  public successMessage: string | null = null;

  ngOnInit() {
    // Escuchar mensajes de éxito y error
    this.notificationService.successMessage$.subscribe(
      (message) => (this.successMessage = message)
    );
  }
}
