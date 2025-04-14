import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';

/**
 * Servicio para la gestión de archivos.
 * 
 * @description
 * Proporciona métodos para interactuar con la API de archivos:
 * - Creación de archivos
 * - Eliminación de archivos
 * - Descarga de archivos
 * 
 * @example
 * ```typescript
 * constructor(private fileService: FileService) {}
 * 
 * // Crear un archivo
 * this.fileService.storeFiles(data).subscribe();
 * 
 * // Descargar un archivo
 * this.fileService.downloadFile(id).subscribe();
 * ```
 */
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
  fetchFile(query: string, page: number = 1, show: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/api/files?q=${query}&page=${page}&show=${show}`, // Realizar la solicitud GET con paginación
    );
  }

  /**
   * Crea un nuevo archivo en el sistema.
   * 
   * @param data - Objeto con los datos del archivo a crear
   * @returns Observable<string> - Mensaje de éxito de la operación
   * 
   * @example
   * ```typescript
   * const data = {
   *   name: 'documento.pdf',
   *   description: 'Documento importante'
   * };
   * this.fileService.storeFiles(data).subscribe();
   * ```
   */
  storeFiles(data: {}): Observable<string> {
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/api/files`, data)
      .pipe(
        map((response) => {
          return response.message;
        }),
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
        }),
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
        }),
      );
  }

  /**
   * Elimina un archivo específico del sistema.
   * 
   * @param id - Identificador único del archivo a eliminar
   * @returns Observable<string> - Mensaje de éxito de la operación
   * 
   * @example
   * ```typescript
   * this.fileService.deleteFile(123).subscribe();
   * ```
   */
  deleteFile(id: number): Observable<string> {
    return this.http
      .delete<{ message: string }>(`${this.apiUrl}/api/files/${id}`)
      .pipe(
        map((response) => {
          return response.message;
        }),
      );
  }

  /**
   * Descarga un archivo específico del sistema.
   * 
   * @param id - Identificador único del archivo a descargar
   * @returns Observable<HttpResponse<Blob>> - Respuesta HTTP con el archivo
   * 
   * @example
   * ```typescript
   * this.fileService.downloadFile(123).subscribe(response => {
   *   const blob = response.body;
   *   const filename = 'documento.pdf';
   *   saveAs(blob, filename);
   * });
   * ```
   */
  downloadFile(id: number): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.apiUrl}/api/files/${id}/download`, {
      responseType: 'blob',
      observe: 'response',
    });
  }
}
