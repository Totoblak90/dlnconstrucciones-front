import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  BatchComplete,
  Lotes,
  PostalZones,
} from '../modules/main/interfaces/http/batches.interface';
import { Interests } from '../modules/main/interfaces/http/interests.interface';
import {
  Job,
  TypesOfJobs,
} from '../modules/main/interfaces/http/jobs.interface';
import {
  Services,
  TipoServicio,
} from '../modules/main/interfaces/http/services.interface';
import {
  Contact,
  ContactFormRes,
} from '../modules/main/interfaces/http/contact.interface';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  /**
   * Obtiene las zonas en las cuales se venden lotes y/o construyen casas
   *
   * @return {*}  {Observable<PostalZones>}
   * @memberof HttpService
   */
  public getAllZones(): Observable<PostalZones> {
    return this.http.get<PostalZones>(`${environment.API_BASE_URL}/categories`);
  }

  /**
   * Obtiene los lotes relacionados a una zona
   *
   * @param zonaId: string
   * @return {*}  {Observable<Lotes>}
   * @memberof HttpService
   */
  public getLotes(zonaId: string): Observable<Lotes> {
    return this.http.get<Lotes>(
      `${environment.API_BASE_URL}/categories/${zonaId}`
    );
  }

  /**
   * Obtiene el detalle de un lote particular
   *
   * @param loteId: string
   * @return {*}  {Observable<BatchComplete>}
   * @memberof HttpService
   */
  public getDetalleLote(loteId: string): Observable<BatchComplete> {
    return this.http.get<BatchComplete>(
      `${environment.API_BASE_URL}/batches/${loteId}`
    );
  }

  /**
   * Obtiene todos los servicios que ofrece la compañía
   *
   * @return {*}  {Observable<Services>}
   * @memberof HttpService
   */
  public getAllServices(): Observable<Services> {
    return this.http.get<Services>(`${environment.API_BASE_URL}/services`);
  }
  public getOneService(id: string): Observable<TipoServicio> {
    return this.http.get<TipoServicio>(
      `${environment.API_BASE_URL}/services/${id}`
    );
  }

  /**
   * Obtiene todos los trabajos realizados por la compañía
   *
   * @return {*}  {Observable<TypesOfJobs>}
   * @memberof HttpService
   */
  public getTypesOfJob(): Observable<TypesOfJobs> {
    return this.http.get<TypesOfJobs>(`${environment.API_BASE_URL}/types`);
  }

  /**
   * Obtiene uno de los tipos de trabajo realizados por la compañía
   *
   * @param jobTypeID: string
   * @return {*}  {Observable<Job>}
   * @memberof HttpService
   */
  public getOneTypeOfJob(jobTypeID: string): Observable<Job> {
    return this.http.get<Job>(`${environment.API_BASE_URL}/types/${jobTypeID}`);
  }

  /**
   * Obtiene los artículos de interés creados por la compañía
   *
   * @return {*}  {Observable<Interests>}
   * @memberof HttpService
   */
  public getInterests(): Observable<Interests> {
    return this.http.get<Interests>(`${environment.API_BASE_URL}/interests`);
  }

  /**
   * Envía el formulario de contacto
   *
   * @param form: Contact
   * @return {*}  {Observable<ContactFormRes>}
   * @memberof HttpService
   */
  public sendContactForm(form: Contact): Observable<ContactFormRes> {
    return this.http.post<ContactFormRes>(
      `${environment.API_BASE_URL}/contact`,
      form
    );
  }
}
