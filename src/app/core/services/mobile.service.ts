import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MobileService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

  /**
   * Obtener una lista de móviles con soporte de paginación.
   * @param page Número de página actual (por defecto, 1).
   * @param show Número de elementos por página.
   * @returns Observable con la lista de móviles.
   */
  fetchMobiles(page: number = 1, show: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/api/mobiles?page=${page}&show=${show}`
    );
  }

  /**
   * Crear un nuevo móvil.
   * @param data Objeto con los datos del nuevo móvil.
   * @returns Observable con el mensaje de éxito.
   */
  storeMobile(data: {}): Observable<string> {
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/api/mobiles`, data)
      .pipe(map((response) => response.message));
  }

  /**
   * Actualizar un móvil existente.
   * @param id Identificador del móvil que se va a actualizar.
   * @param data Objeto con los datos actualizados del móvil.
   * @returns Observable con el mensaje de éxito.
   */
  updateMobile(id: number, data: {}): Observable<string> {
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/api/mobiles/${id}`, data)
      .pipe(map((response) => response.message));
  }

  /**
   * Obtener los datos de un móvil específico por su ID.
   * @param id Identificador del móvil.
   * @returns Observable con los datos del móvil.
   */
  getMobileById(id: number): Observable<any> {
    return this.http
      .get<{ data: any }>(`${this.apiUrl}/api/mobiles/${id}`)
      .pipe(map((response) => response.data));
  }

  /**
   * Eliminar un móvil específico.
   * @param id Identificador del móvil que se va a eliminar.
   * @returns Observable con el mensaje de éxito.
   */
  deleteMobile(id: number): Observable<string> {
    return this.http
      .delete<{ message: string }>(`${this.apiUrl}/api/mobiles/${id}`)
      .pipe(map((response) => response.message));
  }

  /**
   * Subir un archivo Excel o CSV para importar móviles.
   * @param file Archivo a subir.
   * @returns Observable con el progreso de la subida.
   */
  uploadMobiles(file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file);

    const req = new HttpRequest(
      'POST',
      `${this.apiUrl}/api/mobiles/import`,
      formData,
      {
        reportProgress: true,
        responseType: 'json',
      }
    );

    return this.http.request(req);
  }

  /**
   * Descargar un archivo Excel o CSV para exportar móviles.
   * @returns Observable con el archivo.
   */
  exportMobiles(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/api/mobiles/export`, {
      responseType: 'blob',
    });
  }
}
