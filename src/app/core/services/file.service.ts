import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

  /**
   * Obtener una lista de archivos con soporte de paginación.
   * @param page Número de página actual (por defecto, 1).
   * @param show Número de elementos por página.
   * @returns Observable con la lista de archivos.
   */
  fetchFile(page: number = 1, show: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/api/files?page=${page}&show=${show}` // Realizar solicitud GET con parámetros de paginación
    );
  }

  /**
   * Crear un nuevo archivo.
   * @param data Objeto con los datos del nuevo archivo.
   * @returns Observable con el mensaje de éxito.
   */
  storeFiles(data: {}): Observable<string> {
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/api/files`, data) // Realizar solicitud POST
      .pipe(
        map((response) => {
          return response.message; // Extraer el mensaje de éxito del servidor
        })
      );
  }

  /**
   * Actualizar un archivo existente.
   * @param id Identificador del archivo que se va a actualizar.
   * @param data Objeto con los datos actualizados del archivo.
   * @returns Observable con el mensaje de éxito.
   */
  updateFile(id: number, data: {}): Observable<string> {
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/api/files/${id}`, data)
      .pipe(
        map((response) => {
          return response.message;
        })
      );
  }

  /**
   * Obtener los datos de un archivo específico por su ID.
   * @param id Identificador del archivo.
   * @returns Observable con los datos del archivo.
   */
  getFileById(id: number): Observable<any> {
    return this.http
      .get<{ data: any }>(`${this.apiUrl}/api/files/${id}`) // Realizar solicitud GET
      .pipe(
        map((response) => {
          return response.data; // Extraer los datos del archivo del servidor
        })
      );
  }

  /**
   * Eliminar un archivo específico.
   * @param id Identificador del archivo que se va a eliminar.
   * @returns Observable con el mensaje de éxito.
   */
  deleteFile(id: number): Observable<string> {
    return this.http
      .delete<{ message: string }>(`${this.apiUrl}/api/files/${id}`) // Realizar solicitud DELETE
      .pipe(
        map((response) => {
          return response.message; // Extraer el mensaje de éxito del servidor
        })
      );
  }

  /**
   * Descargar un archivo por su ID.
   * @param id Identificador del archivo.
   * @param fileName Nombre del archivo para la descarga.
   */
  downloadFile(id: number): Observable<HttpResponse<Blob>> { // <-- Cambio aquí
    return this.http.get(`${this.apiUrl}/api/files/${id}/download`, {
      responseType: 'blob',
      observe: 'response' // <-- Añade esta opción
    });
  }
}
