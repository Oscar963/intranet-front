import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AnexoService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

  /**
   * Obtener una lista de anexos con soporte de paginación.
   * @param page Número de página actual (por defecto, 1).
   * @param show Número de elementos por página.
   * @returns Observable con la lista de anexos.
   */
  fetchAnexos(page: number = 1, show: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/api/anexos?page=${page}&show=${show}`
    );
  }

  /**
   * Crear un nuevo anexo.
   * @param data Objeto con los datos del nuevo anexo.
   * @returns Observable con el mensaje de éxito.
   */
  storeAnexo(data: {}): Observable<string> {
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/api/anexos`, data)
      .pipe(map((response) => response.message));
  }

  /**
   * Actualizar un anexo existente.
   * @param id Identificador del anexo que se va a actualizar.
   * @param data Objeto con los datos actualizados del anexo.
   * @returns Observable con el mensaje de éxito.
   */
  updateAnexo(id: number, data: {}): Observable<string> {
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/api/anexos/${id}`, data)
      .pipe(map((response) => response.message));
  }

  /**
   * Obtener los datos de un anexo específico por su ID.
   * @param id Identificador del anexo.
   * @returns Observable con los datos del anexo.
   */
  getAnexoById(id: number): Observable<any> {
    return this.http
      .get<{ data: any }>(`${this.apiUrl}/api/anexos/${id}`)
      .pipe(map((response) => response.data));
  }

  /**
   * Eliminar un anexo específico.
   * @param id Identificador del anexo que se va a eliminar.
   * @returns Observable con el mensaje de éxito.
   */
  deleteAnexo(id: number): Observable<string> {
    return this.http
      .delete<{ message: string }>(`${this.apiUrl}/api/anexos/${id}`)
      .pipe(map((response) => response.message));
  }

  /**
   * Subir un archivo Excel o CSV para importar anexos.
   * @param file Archivo a subir.
   * @returns Observable con el progreso de la subida.
   */

  uploadAnexos(file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file);

    const req = new HttpRequest(
      'POST',
      `${this.apiUrl}/api/anexos/import`,
      formData,
      {
        reportProgress: true,
        responseType: 'json',
      }
    );

    return this.http.request(req);
  }

  /**
   * Descargar un archivo Excel o CSV para exportar anexos.
   * @returns Observable con el archivo.
   */
  exportAnexos(): Observable<Blob> {    
    return this.http.get(`${this.apiUrl}/api/anexos/export`, {
      responseType: 'blob',
    });
  }
}
