import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateCashflowRes } from '../interfaces/cashflows.interface';

@Injectable({
  providedIn: 'root',
})
export class CashflowsService {
  constructor(private http: HttpClient) {}

  /**
   * Crea un cashflow
   *
   * @param {FormData} payload
   * @return {*}  {Observable<CreateCashflowRes>}
   * @memberof CashflowsService
   */
  public createCashflow(payload: FormData): Observable<CreateCashflowRes> {
    return this.http.post<CreateCashflowRes>(
      `${environment.API_BASE_URL}/cashflows/create`,
      payload
    );
  }

  /**
   * Edita un cashflow
   *
   * @param {FormData} payload
   * @param {(string | number)} cashflowID
   * @return {*}  {Observable<any>}
   * @memberof CashflowsService
   */
  public editCashflow(
    payload: FormData,
    cashflowID: string | number
  ): Observable<any> {
    return this.http.patch(
      `${environment.API_BASE_URL}/cashflows/edit/${cashflowID}`,
      payload
    );
  }

  /**
   * Elimina un cashflow
   *
   * @param {(string | number)} cashflowID
   * @return {*}  {Observable<any>}
   * @memberof CashflowsService
   */
  public deleteCashflow(cashflowID: number): Observable<any> {
    return this.http.delete(
      `${environment.API_BASE_URL}/cashflows/delete/${cashflowID}`,
      {}
    );
  }
}
