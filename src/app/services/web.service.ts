import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WebService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

  /**
   * Obtener una lista de banners.
   * @param page Número de página actual (por defecto, 1).
   * @param show Número de elementos por página.
   * @returns Observable con la lista de banners.
   */
  fetchBanners(): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/api/web/banners`)
      .pipe(map((response) => response));
  }

  /**
   * Obtener una lista de popups.
   * @param page Número de página actual (por defecto, 1).
   * @param show Número de elementos por página.
   * @returns Observable con la lista de popups.
   */
  fetchPopups(page: number = 1, show: number): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/api/web/popups?page=${page}&show=${show}`)
      .pipe(map((response) => response));
  }

  /**
   * Obtener una lista de páginas.
   * @param page Número de página actual (por defecto, 1).
   * @param show Número de elementos por página.
   * @returns Observable con la lista de páginas.
   */
  fetchPages(page: number = 1, show: number): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/api/web/pages?page=${page}&show=${show}`)
      .pipe(map((response) => response));
  }

  /**
   * Obtener un banner específico por su ID.
   * @param id Identificador del banner.
   * @returns Observable con los datos del banner.
   */
  getBannerById(id: number): Observable<any> {
    return this.http
      .get<{ data: any }>(`${this.apiUrl}/api/web/banners/${id}`)
      .pipe(map((response) => response.data));
  }

  /**
   * Obtener un popup específico por su ID.
   * @param id Identificador del popup.
   * @returns Observable con los datos del popup.
   */
  getPopupById(id: number): Observable<any> {
    return this.http
      .get<{ data: any }>(`${this.apiUrl}/api/web/popups/${id}`)
      .pipe(map((response) => response.data));
  }

  /**
   * Obtener una página específica por su ID.
   * @param id Identificador de la página.
   * @returns Observable con los datos de la página.
   */
  getPageById(id: number): Observable<any> {
    return this.http
      .get<{ data: any }>(`${this.apiUrl}/api/web/pages/id/${id}`)
      .pipe(map((response) => response.data));
  }

  /**
   * Obtener un popup específico por su ID.
   * @param id Identificador del popup.
   * @returns Observable con los datos del popup.
   */
  getPageBySlug(slug: string): Observable<any> {    
    return this.http
      .get<{ data: any }>(`${this.apiUrl}/api/web/pages/slug/${slug}`)
      .pipe(map((response) => response.data));
  }

  /**
   * Buscar archivos por nombre o descripción.
   * @param query Texto de búsqueda.
   * @returns Observable con los archivos que coincidan con la búsqueda.
   */
  searchFiles(query: string): Observable<any> {
    return this.http
      .get<{ data: any }>(`${this.apiUrl}/api/web/files/search?q=${query}`)
      .pipe(map((response) => response.data));
  }

  /**
   * Descargar un archivo por su ID.
   * @param id Identificador del archivo.
   * @param fileName Nombre del archivo para la descarga.
   */
  downloadFile(id: number): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.apiUrl}/api/web/pages/files/${id}/download`, {
      responseType: 'blob',
      observe: 'response', // <-- Añade esta opción
    });
  }

  /**
   * Buscar anexos por nombre o descripción.
   * @param query Texto de búsqueda.
   * @returns Observable con los archivos que coincidan con la búsqueda.
   */
  searchAnexos(query: string, page: number = 1, show: number): Observable<any> {
    return this.http
      .get<any>(
        `${this.apiUrl}/api/web/anexos/search?q=${query}&page=${page}&show=${show}`,
      )
      .pipe(map((response) => response.data));
  }

  /**
   * Buscar mobiles por nombre o descripción.
   * @param query Texto de búsqueda.
   * @returns Observable con los archivos que coincidan con la búsqueda.
   */
  searchMobiles(
    query: string,
    page: number = 1,
    show: number,
  ): Observable<any> {
    return this.http
      .get<any>(
        `${this.apiUrl}/api/web/mobiles/search?q=${query}&page=${page}&show=${show}`,
      )
      .pipe(map((response) => response.data));
  }
}
