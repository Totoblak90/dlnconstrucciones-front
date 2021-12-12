import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../../../models/user.model';
import {
  IdentifyToken,
  LoginForm,
  LoginRes,
  RegisterForm,
  RegisterRes,
} from '../interfaces/http/auth.interface';
import { getToken } from '../helpers/functions.helper';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _loggedUser!: User;

  private headers: HttpHeaders = new HttpHeaders({
    'access-token': getToken(),
  });

  constructor(private httpClient: HttpClient, private router: Router) {}

  public loginWithToken(token: string): Observable<IdentifyToken> {
    return this.httpClient.post<IdentifyToken>(
      `${environment.API_BASE_URL}/users/identify`,
      token,
      { headers: this.headers }
    );
  }

  public login(payload: LoginForm): Observable<LoginRes> {
    return this.httpClient.post<LoginRes>(
      `${environment.API_BASE_URL}/users/login`,
      payload
    );
  }

  public register(payload: RegisterForm): Observable<RegisterRes> {
    return this.httpClient.post<RegisterRes>(
      `${environment.API_BASE_URL}/users/register`,
      payload
    );
  }

  public logout(): void {
    localStorage.removeItem('access-token');
    window.location.reload();
  }

  public getUser(): User {
    return this._loggedUser as User;
  }

  public setUser(user: User): void {
    this._loggedUser = user;
  }
}
