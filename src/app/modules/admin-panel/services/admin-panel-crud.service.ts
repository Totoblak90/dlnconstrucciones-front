import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { getToken } from '../../main/helpers/functions.helper';
import { AdminPanelCrudRoutes } from '../interfaces/general.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminPanelCrudService {

  private headers: HttpHeaders = new HttpHeaders({
    'access-token': getToken(),
  });

  constructor(private http: HttpClient) {}

  /**
   * Crea un nuevo registro en la tabla indicada
   *
   * @param payload: FormData
   * @param tabla: AdminPanelCrudRoutes
   * @return {*}  {Observable<any>}
   * @memberof AdminPanelCrudService
   */
  public create(payload: FormData, tabla: AdminPanelCrudRoutes): Observable<any> {
    return this.http.post<any>(
      `${environment.API_BASE_URL}/${tabla}/create`,
      payload,
      { headers: this.headers }
    );
  }

  /**
   * Edita un registro en la tabla indicada
   *
   * @param id: number
   * @param payload: FormData
   * @param tabla: AdminPanelCrudRoutes
   * @return {*}  {Observable<any>}
   * @memberof AdminPanelCrudService
   */
  public edit(id: number, payload: FormData, tabla: AdminPanelCrudRoutes): Observable<any> {
    return this.http.patch<any>(
      `${environment.API_BASE_URL}/${tabla}/edit/${id}`,
      payload,
      { headers: this.headers }
    );
  }

  /**
   * Elimina un registro en la tabla indicada
   *
   * @param id: number
   * @param tabla: AdminPanelCrudRoutes
   * @return {*}  {Observable<any>}
   * @memberof AdminPanelCrudService
   */
  public delete(id: number, tabla: AdminPanelCrudRoutes): Observable<any> {
    return this.http.delete<any>(
      `${environment.API_BASE_URL}/${tabla}/delete/${id}`,
      { headers: this.headers }
    );
  }
}
