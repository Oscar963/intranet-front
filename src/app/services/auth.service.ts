import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

  // Obtener el token CSRF
  getCsrfCookie(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sanctum/csrf-cookie`);
  }

  // Iniciar sesión
  login(credentials: {
    rut: string;
    password: string;
    remember: boolean;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/login`, credentials).pipe(
      map((response: any) => response.message),
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  // Cerrar sesión
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/logout`, {}).pipe(
      map(() => {
        // this.clearUser();
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }


  // Olvido de contraseña
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/forgot-password`, { email }).pipe(
      map((response: any) => response.message),
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  // Restablecer contraseña
  resetPassword(data: {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/reset-password`, data).pipe(
      map((response: any) => response.status),
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido.';
    if (error.status === 429) {
      errorMessage = error.error.message;
    } else if (error.status === 401) {
      errorMessage = error.error;
    } else {
      errorMessage = error.error.error || errorMessage;
    }
    return throwError(errorMessage);
  }
}
