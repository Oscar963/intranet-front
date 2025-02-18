import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

  /**
   * Obtener una lista de banners con soporte de paginación.
   * @param page Número de página actual (por defecto, 1).
   * @param show Número de elementos por página.
   * @returns Observable con la lista de banners.
   */
  fetchBanner(page: number = 1, show: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/api/banners?page=${page}&show=${show}` // Realizar la solicitud GET con paginación
    );
  }

  /**
   * Crear un nuevo banner.
   * @param data Objeto con los datos del nuevo banner.
   * @returns Observable con el mensaje de éxito.
   */
  storeBanner(data: {}): Observable<string> {
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/api/banners`, data) // Realizar la solicitud POST
      .pipe(
        map((response) => {
          return response.message; // Extraer el mensaje de éxito del servidor
        })
      );
  }

  /**
   * Actualizar un banner existente.
   * @param id Identificador del banner que se va a actualizar.
   * @param data Objeto con los datos actualizados del banner.
   * @returns Observable con el mensaje de éxito.
   */
  updateBanner(id: number, data: {}): Observable<string> {
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/api/banners/${id}`, data) // Realizar la solicitud POST para la actualización
      .pipe(
        map((response) => {
          return response.message; // Extraer el mensaje de éxito del servidor
        })
      );
  }

  /**
   * Obtener los datos de un banner específico por su ID.
   * @param id Identificador del banner.
   * @returns Observable con los datos del banner.
   */
  getBannerById(id: number): Observable<any> {
    return this.http
      .get<{ data: any }>(`${this.apiUrl}/api/banners/${id}`) // Realizar la solicitud GET
      .pipe(
        map((response) => {
          return response.data; // Extraer los datos del banner del servidor
        })
      );
  }

  /**
   * Eliminar un banner específico.
   * @param id Identificador del banner que se va a eliminar.
   * @returns Observable con el mensaje de éxito.
   */
  deleteBanner(id: number): Observable<string> {
    return this.http
      .delete<{ message: string }>(`${this.apiUrl}/api/banners/${id}`) // Realizar la solicitud DELETE
      .pipe(
        map((response) => {
          return response.message; // Extraer el mensaje de éxito del servidor
        })
      );
  }
}
