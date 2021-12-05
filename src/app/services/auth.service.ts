import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Login, LoginForm } from '../interfaces/http/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  public login(payload: LoginForm): Observable<Login> {
    return this.httpClient.post<LoginForm>(`${environment.API_BASE_URL}/api/users/login`, payload)
  }
}
