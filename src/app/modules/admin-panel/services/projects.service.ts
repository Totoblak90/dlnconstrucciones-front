import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { getToken } from '../../main/helpers/functions.helper';
import { AdminPanelCrudRoutes } from '../interfaces/general.interface';
import { ProjectPaymentsReq } from '../interfaces/projects.interface';
import { AllProjectsRes, OneProjectRes } from '../interfaces/users.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private headers: HttpHeaders = new HttpHeaders({
    'access-token': getToken(),
  });

  constructor(private http: HttpClient) {}

  /**
   * Obtiene una lista de todos los proyectos existentes en la app con su información completa.
   *
   * @return {*}  {Observable<AllProjectsRes>}
   * @memberof UsersService
   */
  public getAllProjects(): Observable<AllProjectsRes> {
    return this.http.get<AllProjectsRes>(
      `${environment.API_BASE_URL}/projects`,
      {
        headers: this.headers,
      }
    );
  }

  /**
   * Obtiene el proyecto relacionado al id y el usuario relacionado a ese proyecto.
   *
   * @return {*}  {Observable<OneProjectRes>}
   * @memberof UsersService
   */
  public getOneProject(projectId: number): Observable<OneProjectRes> {
    return this.http.get<OneProjectRes>(
      `${environment.API_BASE_URL}/projects/${projectId}`,
      {
        headers: this.headers,
      }
    );
  }

  /**
   * Crea un nuevo registro en la tabla indicada
   *
   * @param payload: FormData
   * @param tabla: AdminPanelCrudRoutes
   * @return {*}  {Observable<any>}
   * @memberof AdminPanelCrudService
   */
  public create(
    payload: ProjectPaymentsReq,
    tabla: AdminPanelCrudRoutes
  ): Observable<any> {
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
   * @return {*}  {Observable<any>}
   * @memberof AdminPanelCrudService
   */
  public edit(
    id: number,
    payload: ProjectPaymentsReq,
    tabla: AdminPanelCrudRoutes
  ): Observable<any> {
    return this.http.patch<any>(
      `${environment.API_BASE_URL}/${tabla}/edit/${id}`,
      payload,
      { headers: this.headers }
    );
  }

  /**
   * Trae un cashflow de un usuario
   *
   * @param cashflowName: string
   * @return {*}  {Observable<any>}
   * @memberof AdminPanelCrudService
   */
  public getCashflow(cashflowName: string): Observable<any> {
    return this.http.get(
      `${environment.API_BASE_URL}/projects/cashflow/${cashflowName}`,
      { headers: this.headers, responseType: 'arraybuffer' }
    );
  }
}
