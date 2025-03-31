import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

  /**
   * Obtener una lista de usuarios con paginación.
   * @param page Número de página.
   * @param show Cantidad de usuarios por página.
   * @returns Observable con los datos de usuarios.
   */
  fetchUsers(query: string, page: number = 1, show: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/api/users?q=${query}&page=${page}&show=${show}`, // Realizar la solicitud GET con paginación
    );
  }

  /**
   * Crear un nuevo usuario.
   * @param data Datos del usuario a crear.
   * @returns Observable con el mensaje de éxito.
   */
  storeUser(data: {}): Observable<string> {
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/api/users`, data)
      .pipe(
        map((response) => {
          return response.message;
        }),
      );
  }

  /**
   * Actualizar un usuario existente.
   * @param id ID del usuario a actualizar.
   * @param data Datos del usuario actualizados.
   * @returns Observable con el mensaje de éxito.
   */
  updateUser(id: number, data: {}): Observable<string> {
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/api/users/${id}`, data)
      .pipe(
        map((response) => {
          return response.message;
        }),
      );
  }

  /**
   * Obtener un usuario por su ID.
   * @param id ID del usuario.
   * @returns Observable con los datos del usuario.
   */
  getUserById(id: number): Observable<any> {
    return this.http.get<{ data: any }>(`${this.apiUrl}/api/users/${id}`).pipe(
      map((response) => {
        return response.data;
      }),
    );
  }

  /**
   * Eliminar un usuario.
   * @param id ID del usuario a eliminar.
   * @returns Observable con el mensaje de éxito.
   */
  deleteUser(id: number): Observable<string> {
    return this.http
      .delete<{ message: string }>(`${this.apiUrl}/api/users/${id}`)
      .pipe(
        map((response) => {
          return response.message;
        }),
      );
  }

  /**
   * Restablecer la contraseña de un usuario.
   * @param id ID del usuario.
   * @param password Nueva contraseña del usuario.
   * @returns Observable con el mensaje de éxito.
   */
  resetPassword(id: number, data: {}): Observable<string> {
    return this.http
      .post<{
        message: string;
      }>(`${this.apiUrl}/api/users/reset-password/${id}`, data)
      .pipe(
        map((response) => {
          return response.message;
        }),
      );
  }

  /**
   * Actualizar la contraseña de un usuario.
   * @param id ID del usuario.
   * @param password Nueva contraseña del usuario.
   * @returns Observable con el mensaje de éxito.
   */
  updatePassword(data: {}): Observable<string> {
    return this.http
      .post<{
        message: string;
      }>(`${this.apiUrl}/api/users/update-password`, data)
      .pipe(
        map((response) => {
          return response.message;
        }),
      );
  }

  /**
   * Obtener un usuario
   * @returns Observable con los datos del usuario.
   */
  getUserProfile(): Observable<any> {
    return this.http
      .get<{ data: any }>(`${this.apiUrl}/api/users/profile`)
      .pipe(
        map((response) => {
          return response.data;
        }),
      );
  }

  updateProfile(data: {}): Observable<string> {
    return this.http
      .post<{
        message: string;
      }>(`${this.apiUrl}/api/users/update-profile`, data)
      .pipe(
        map((response) => {
          return response.message;
        }),
      );
  }
}
