import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { getToken } from '../../main/helpers/functions.helper';

@Injectable({
  providedIn: 'root'
})
export class TrabajosRealizadosAdminService {
  private headers: HttpHeaders = new HttpHeaders({
    'access-token': getToken(),
  });

  constructor(private http: HttpClient) {}

  /**
   * Crea un trabajo realizado
   *
   * @param payload: any
   * @return {*}  {Observable<any>}
   * @memberof TrabajosRealizadosAdminService
   */
  public crearTrabajoRealizado(payload: FormData): Observable<any> {
    return this.http.post<any>(
      `${environment.API_BASE_URL}/jobs/create`,
      payload,
      { headers: this.headers }
    );
  }

  /**
   * Edita un trabajo Realizado
   *
   * @param id: number
   * @param payload: any
   * @return {*}  {Observable<TrabajosRealizadosAdminService>}
   * @memberof TrabajosRealizadosAdminService
   */
  public editarTrabajoRealizado(id: number, payload: FormData): Observable<any> {
    return this.http.patch<any>(
      `${environment.API_BASE_URL}/jobs/edit/${id}`,
      payload,
      { headers: this.headers }
    );
  }

  /**
   * Elimina un lote
   *
   * @param id: number
   * @return {*}  {Observable<any>}
   * @memberof TrabajosRealizadosAdminService
   */
  public borrarTrabajoRealizado(id: number): Observable<any> {
    return this.http.delete<any>(
      `${environment.API_BASE_URL}/jobs/delete/${id}`,
      { headers: this.headers }
    );
  }
}
