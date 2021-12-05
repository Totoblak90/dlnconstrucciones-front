import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Interests } from '../interfaces/http/interests.interface';
import { Job, TypesOfJobs } from '../interfaces/http/jobs.interface';
import { Services, TipoServicio } from '../interfaces/http/services.interface';
import { Lotes, PostalZones, Batch, BatchComplete } from '../interfaces/http/batches.interface';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor( private http: HttpClient) { }
  // Pido las localidades y los lotes.
  public getAllZones(): Observable<PostalZones> {
    return this.http.get<PostalZones>(`${environment.API_BASE_URL}/categories`)
  }
  public getLotes(categoryID: string): Observable<Lotes> {
    return this.http.get<Lotes>(`${environment.API_BASE_URL}/categories/${categoryID}`)
  }

  public getDetalleLote(loteId: string): Observable<BatchComplete> {
    return this.http.get<BatchComplete>(`${environment.API_BASE_URL}/batches/${loteId}`)
  }
  // Pido los servicios
  public getAllServices(): Observable<Services> {
    return this.http.get<Services>(`${environment.API_BASE_URL}/services`);
  }
  public getOneService(id: string): Observable<TipoServicio> {
    return this.http.get<TipoServicio>(`${environment.API_BASE_URL}/services/${id}`)
  }
  // --------------------------------------------------------------------------
  // Pido los trabajos realizados
  public getTypesOfJob(): Observable<TypesOfJobs> {
    return this.http.get<TypesOfJobs>(`${environment.API_BASE_URL}/types`)
  }
  public getOneTypeOfJob(typeID: string): Observable<Job> {
    return this.http.get<Job>(`${environment.API_BASE_URL}/types/${typeID}`)
  }
  // ---------------------------------------------------------------------------
  // Pido los intereses para la Home page
  public getInterests(): Observable<Interests> {
    return this.http.get<Interests>(`${environment.API_BASE_URL}/interests`);
  }
  // ---------------------------------------------------------------------------
  // Formulario de contacto
  public sendContactForm(): unknown {
    return;
  }

}
