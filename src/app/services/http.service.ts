import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Services } from '../interfaces/http/services.interface';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor( private http: HttpClient) { }

  public getAllServices(): Observable<Services> {
    return this.http.get<Services>(`${environment.API_BASE_URL}/services`);
  }

}
