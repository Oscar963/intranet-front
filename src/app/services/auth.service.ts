import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { User } from '../../app/interfaces/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.API_URL;
  private isAuthenticatedState: boolean = false;
  private user: BehaviorSubject<User> = new BehaviorSubject<User>({
    id: 0,
    name: '',
    paternal_surname: '',
    maternal_surname: '',
    rut: '',
    email: '',
    status: 0,
  });

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  getCsrfCookie(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sanctum/csrf-cookie`);
  }

  login(rut: string, password: string, remember: boolean): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/api/login`, {
        rut,
        password,
        remember,
      })
      .pipe(
        map((response: any) => {
          this.isAuthenticatedState = true;
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          this.isAuthenticatedState = false;
          return throwError(error);
        }),
      );
  }

  logout(): Observable<any> {
    this.isAuthenticatedState = false;
    return this.http.post<any>(`${this.apiUrl}/api/logout`, {});
  }

  checkAuthentication(): Observable<boolean> {
    return this.http.get(`${this.apiUrl}/api/isAuthenticated`).pipe(
      map((response: any) => {
        this.isAuthenticatedState = true;
        return response.isAuthenticated;
      }),
      catchError(() => {
        this.isAuthenticatedState = false;
        return of(false);
      }),
    );
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedState;
  }

  forgotPassword(email: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/api/forgot-password`, { email })
      .pipe(map((response: any) => response.message));
  }

  resetPassword(data: {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
  }): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/api/reset-password`, data)
      .pipe(map((response: any) => response.status));
  }

  fetchUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/api/user`).pipe(
      tap((user: User) => {
        this.setUserObservable(user);
        return user;
      }),
    );
  }

  getUserObservable() {
    return this.user.asObservable();
  }

  setUserObservable(user: User) {
    this.user.next(user);
  }
}
