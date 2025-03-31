import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

  /**
   * Obtener una lista de popups con soporte de paginación.
   * @param page Número de página actual (por defecto, 1).
   * @param show Número de elementos por página.
   * @returns Observable con la lista de popups.
   */
  fetchPopup(query: string, page: number = 1, show: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/api/popups?q=${query}&page=${page}&show=${show}`, // Realizar la solicitud GET con paginación
    );
  }

  /**
   * Crear un nuevo popup.
   * @param data Objeto con los datos del nuevo popup.
   * @returns Observable con el mensaje de éxito.
   */
  storePopup(data: {}): Observable<string> {
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/api/popups`, data) // Realizar solicitud POST
      .pipe(
        map((response) => {
          return response.message; // Extraer el mensaje de éxito del servidor
        }),
      );
  }

  /**
   * Actualizar un popup existente.
   * @param id Identificador del popup que se va a actualizar.
   * @param data Objeto con los datos actualizados del popup.
   * @returns Observable con el mensaje de éxito.
   */
  updatePopup(id: number, data: {}): Observable<string> {
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/api/popups/${id}`, data)
      .pipe(
        map((response) => {
          return response.message;
        }),
      );
  }

  /**
   * Obtener los datos de un popup específico por su ID.
   * @param id Identificador del popup.
   * @returns Observable con los datos del popup.
   */
  getPopupById(id: number): Observable<any> {
    return this.http
      .get<{ data: any }>(`${this.apiUrl}/api/popups/${id}`) // Realizar solicitud GET
      .pipe(
        map((response) => {
          return response.data; // Extraer los datos del popup del servidor
        }),
      );
  }

  /**
   * Eliminar un popup específico.
   * @param id Identificador del popup que se va a eliminar.
   * @returns Observable con el mensaje de éxito.
   */
  deletePopup(id: number): Observable<string> {
    return this.http
      .delete<{ message: string }>(`${this.apiUrl}/api/popups/${id}`) // Realizar solicitud DELETE
      .pipe(
        map((response) => {
          return response.message; // Extraer el mensaje de éxito del servidor
        }),
      );
  }
}
