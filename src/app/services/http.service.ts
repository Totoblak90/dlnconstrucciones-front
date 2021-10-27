import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Job, TypesOfJobs } from '../interfaces/http/jobs.interface';
import { Services } from '../interfaces/http/services.interface';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor( private http: HttpClient) { }

  // Pido los servicios
  public getAllServices(): Observable<Services> {
    return this.http.get<Services>(`${environment.API_BASE_URL}/services`);
  }
  public getOneService(id: string): Observable<unknown> {
    return this.http.get<unknown>(`${environment.API_BASE_URL}/services/${id}`)
  }
  // --------------------------------------------------------------------------
  // Pido los trabajos realizados
  public getTypesOfJob(): Observable<TypesOfJobs> {
    return this.http.get<TypesOfJobs>(`${environment.API_BASE_URL}/types`)
  }
  public getOneTypeOfJob(typeID: string): Observable<Job> {
    return this.http.get<Job>(`${environment.API_BASE_URL}/types/${typeID}`)
  }

}
