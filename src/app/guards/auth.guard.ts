import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  async canActivate(): Promise<boolean> {
    try {
      const user = await this.userService.fetchUser();

      if (!user) {
        this.router.navigate(['/login']);
        return false;
      }

      const isAuthenticated = this.userService.isAuthenticated();

      if (!isAuthenticated) {
        this.router.navigate(['/login']);
        return false;
      }

      return true;
    } catch (error) {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
