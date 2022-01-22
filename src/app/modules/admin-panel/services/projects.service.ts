import {  HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AdminPanelCrudRoutes } from '../interfaces/general.interface';
import { ProjectPaymentsReq } from '../interfaces/projects.interface';
import { AllProjectsRes, OneProjectRes } from '../interfaces/users.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  constructor(private http: HttpClient) {}

  /**
   * Obtiene una lista de todos los proyectos existentes en la app con su información completa.
   *
   * @return {*}  {Observable<AllProjectsRes>}
   * @memberof UsersService
   */
  public getAllProjects(): Observable<AllProjectsRes> {
    return this.http.get<AllProjectsRes>(
      `${environment.API_BASE_URL}/projects`
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
      `${environment.API_BASE_URL}/projects/${projectId}`
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
      payload
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
      payload
    );
  }

  /**
   * Trae un cashflow de un usuario
   *
   * @param cashflowName: string
   * @return {*}  {Observable<Blob>}
   * @memberof AdminPanelCrudService
   */
  public getCashflow(cashflowName: string): Observable<Blob> {
    return this.http.get(
      `${environment.API_BASE_URL}/projects/cashflow/${cashflowName}`,
      { responseType: 'blob' }
    );
  }

  /**
   * Trae un asset de un proyecto
   *
   * @param fileName: string
   * @return {*}  {Observable<Blob>}
   * @memberof AdminPanelCrudService
   */
  public getAssetsDeUnProyecto(fileName: string): Observable<Blob> {
    return this.http.get(
      `${environment.API_BASE_URL}/projects/assets/${fileName}`,
      { responseType: 'blob' }
    );
  }
}
