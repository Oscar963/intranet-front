import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.API_URL;
  private user: any = null;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private authService: AuthService) {}
  async fetchUser(): Promise<any> {
    if (!this.user) {
      try {
        const user = await this.http.get(`${this.apiUrl}/api/user`).toPromise();
        this.user = user; // Guarda los datos del usuario en memoria
        return user;
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
        return null;
      }
    }
    return this.user;
  }

  getUser(): any {
    return this.user;
  }

  clearUser(): void {
    this.user = null;
  }

  isAuthenticated(): boolean {
    return !!this.user; 
  }

  
  getIsAuthenticatedState(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable(); // Permitir la suscripción al estado de autenticación
  }
}
