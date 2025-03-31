import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PageService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

  /**
   * Obtener una lista de páginas con soporte de paginación.
   * @param page Número de página actual (por defecto, 1).
   * @param show Número de elementos por página.
   * @returns Observable con la lista de páginas.
   */
  fetchPage(query: string, page: number = 1, show: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/api/pages?q=${query}&page=${page}&show=${show}`, // Realizar la solicitud GET con paginación
    );
  }

  /**
   * Crear una nueva página.
   * @param data Objeto con los datos de la nueva página.
   * @returns Observable con el mensaje de éxito.
   */
  storePage(data: {}): Observable<string> {
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/api/pages`, data) // Realizar solicitud POST
      .pipe(
        map((response) => {
          return response.message; // Extraer el mensaje de éxito del servidor
        }),
      );
  }

  /**
   * Actualizar una página existente.
   * @param id Identificador de la página que se va a actualizar.
   * @param data Objeto con los datos actualizados de la página.
   * @returns Observable con el mensaje de éxito.
   */
  updatePage(id: number, data: {}): Observable<string> {
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/api/pages/${id}`, data) // Realizar solicitud POST para la actualización
      .pipe(
        map((response) => {
          return response.message; // Extraer el mensaje de éxito del servidor
        }),
      );
  }

  /**
   * Obtener los datos de una página específica por su ID.
   * @param id Identificador de la página.
   * @returns Observable con los datos de la página.
   */
  getPageById(id: number): Observable<any> {
    return this.http
      .get<{ data: any }>(`${this.apiUrl}/api/pages/${id}`) // Realizar solicitud GET
      .pipe(
        map((response) => {
          return response.data; // Extraer los datos de la página del servidor
        }),
      );
  }

  /**
   * Eliminar una página específica.
   * @param id Identificador de la página que se va a eliminar.
   * @returns Observable con el mensaje de éxito.
   */
  deletePage(id: number): Observable<string> {
    return this.http
      .delete<{ message: string }>(`${this.apiUrl}/api/pages/${id}`) // Realizar solicitud DELETE
      .pipe(
        map((response) => {
          return response.message; // Extraer el mensaje de éxito del servidor
        }),
      );
  }

  /**
   * Obtener una lista de archivos con soporte de paginación.
   * @param page Número de página actual (por defecto, 1).
   * @param show Número de elementos por página.
   * @returns Observable con la lista de archivos.
   */
  fetchFile(
    idpage: number,
    query: string,
    page: number = 1,
    show: number,
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/api/pages/files?idpage=${idpage}&q=${query}&page=${page}&show=${show}`, // Realizar la solicitud GET con paginación
    );
  }

  /**
   * Crear un nuevo archivo.
   * @param data Objeto con los datos del nuevo archivo.
   * @returns Observable con el mensaje de éxito.
   */
  storeFiles(data: {}): Observable<string> {
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/api/pages/files`, data) // Realizar solicitud POST
      .pipe(
        map((response) => {
          return response.message; // Extraer el mensaje de éxito del servidor
        }),
      );
  }
}
