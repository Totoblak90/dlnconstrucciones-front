import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { getToken } from '../../main/helpers/functions.helper';
import { AllUsersRes } from '../interfaces/users.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  private headers: HttpHeaders = new HttpHeaders({
    'access-token': getToken(),
  });

  /**
   * Obtiene una lista de todos los usuarios registrados en la app con su información completa.
   *
   * @return {*}  {Observable<AllUsersRes>}
   * @memberof UsersService
   */
  public getAllUsers(): Observable<AllUsersRes> {
    return this.http.get<AllUsersRes>(`${environment.API_BASE_URL}/users`, {
      headers: this.headers,
    });
  }
}
