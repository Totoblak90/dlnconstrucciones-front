import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  AllUsersRes,
} from '../interfaces/users.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  /**
   * Obtiene una lista de todos los usuarios registrados en la app con su información completa.
   *
   * @return {*}  {Observable<AllUsersRes>}
   * @memberof UsersService
   */
  public getAllUsers(): Observable<AllUsersRes> {
    return this.http.get<AllUsersRes>(`${environment.API_BASE_URL}/users`);
  }
}
