import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { getToken } from '../../main/helpers/functions.helper';

@Injectable({
  providedIn: 'root',
})
export class LotesService {

  private headers: HttpHeaders =  new HttpHeaders({
    'acces-token': getToken()
  })

  constructor(private http: HttpClient) {}


  /**
   * Crea un nuevo lote
   *
   * @param payload: any
   * @return {*}  {Observable<any>}
   * @memberof LotesService
   */
  public createLote(payload: any): Observable<any> {
    return this.http.post<any>(
      `${environment.API_BASE_URL}/batches/create`,
      payload,
      {headers: this.headers}
    );
  }

  /**
   * Edita un lote
   *
   * @param id: number
   * @param payload: any
   * @return {*}  {Observable<any>}
   * @memberof LotesService
   */
  public editLote(id: number, payload: any): Observable<any> {
    return this.http.patch<any>(
      `${environment.API_BASE_URL}/batches/${id}`,
      payload
    );
  }

  /**
   * Elimina un lote
   *
   * @param id: number
   * @return {*}  {Observable<any>}
   * @memberof LotesService
   */
  public deleteLote(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.API_BASE_URL}/batches/delete/${id}`);
  }
}
