import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AdminPanelCrudRoutes } from '../interfaces/general.interface';
import { editUserRoleReq } from '../interfaces/users.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminPanelCrudService {
  constructor(private http: HttpClient) {}

  /**
   * Crea un nuevo registro en la tabla indicada
   *
   * @param payload: FormData
   * @param tabla: AdminPanelCrudRoutes
   * @return {*}  {Observable<any>}
   * @memberof AdminPanelCrudService
   */
  public create(
    payload: FormData,
    tabla: AdminPanelCrudRoutes
  ): Observable<any> {
    return this.http.post<any>(
      `${environment.API_BASE_URL}/${tabla}/create`,
      payload
    );
  }

  /**
   * Crea un nuevo contenido o imagen en los servicios
   *
   * @param payload: FormData
   * @param tabla: AdminPanelCrudRoutes
   * @return {*}  {Observable<any>}
   * @memberof AdminPanelCrudService
   */
  public createContentOrPictureInService(
    payload: FormData,
    tabla: AdminPanelCrudRoutes
  ): Observable<any> {
    return this.http.post<any>(
      `${environment.API_BASE_URL}/services/${tabla}/create`,
      payload
    );
  }

  /**
   * Edita un registro en la tabla indicada
   *
   * @param {number} id
   * @param {FormData} payload
   * @param {AdminPanelCrudRoutes} tabla
   * @return {*}  {Observable<any>}
   * @memberof AdminPanelCrudService
   */
  public edit(
    id: number,
    payload: FormData,
    tabla: AdminPanelCrudRoutes
  ): Observable<any> {
    return this.http.patch<any>(
      `${environment.API_BASE_URL}/${tabla}/edit/${id}`,
      payload
    );
  }

  /**
   * Edita el rol de un usuario
   *
   * @param id: number
   * @param payload: FormData
   * @return {*}  {Observable<any>}
   * @memberof AdminPanelCrudService
   */
  public editUserRole(id: number, payload: editUserRoleReq): Observable<any> {
    return this.http.patch<any>(
      `${environment.API_BASE_URL}/users/role/${id}`,
      payload
    );
  }

  /**
   * Edita un contenido o una imágen de un servicio
   *
   * @param id: number
   * @param payload: FormData
   * @param tabla: AdminPanelCrudRoutes
   * @return {*}  {Observable<any>}
   * @memberof AdminPanelCrudService
   */
  public editContentOrPictureInService(
    id: number,
    payload: FormData,
    tabla: AdminPanelCrudRoutes
  ): Observable<any> {
    return this.http.patch<any>(
      `${environment.API_BASE_URL}/services/${tabla}/edit/${id}`,
      payload
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
      `${environment.API_BASE_URL}/${tabla}/delete/${id}`
    );
  }

  /**
   * Elimina un contenido o una imágen de un servicio
   *
   * @param id: number
   * @param tabla: AdminPanelCrudRoutes
   * @return {*}  {Observable<any>}
   * @memberof AdminPanelCrudService
   */
  public deleteContentOrImageFromService(
    id: number,
    tabla: AdminPanelCrudRoutes
  ): Observable<any> {
    return this.http.delete<any>(
      `${environment.API_BASE_URL}/services/${tabla}/delete/${id}`
    );
  }
}
