import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../../../models/user.model';
import {
  ActualizarUsuarioReq,
  IdentifyTokenOActualizarUsuario,
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

  /**
   * Obtiene el usuario que machea con el token del localStorage, si este token está guardado
   *
   * @param token: string
   * @return {*}  {Observable<IdentifyToken>}
   * @memberof AuthService
   */
  public loginWithToken(
    token: string
  ): Observable<IdentifyTokenOActualizarUsuario> {
    return this.httpClient.post<IdentifyTokenOActualizarUsuario>(
      `${environment.API_BASE_URL}/users/identify`,
      token,
      { headers: this.headers }
    );
  }

  /**
   * Obtiene el usuario que machea con las credenciales enviadas.
   *
   * @param payload: LoginForm
   * @return {*}  {Observable<LoginRes>}
   * @memberof AuthService
   */
  public login(payload: LoginForm): Observable<LoginRes> {
    return this.httpClient.post<LoginRes>(
      `${environment.API_BASE_URL}/users/login`,
      payload
    );
  }

  /**
   * Crea un usuario en la base de datos con la data que se le envía
   *
   * @param payload: RegisterForm
   * @return {*}  {Observable<RegisterRes>}
   * @memberof AuthService
   */
  public register(payload: RegisterForm): Observable<RegisterRes> {
    return this.httpClient.post<RegisterRes>(
      `${environment.API_BASE_URL}/users/register`,
      payload
    );
  }

  /**
   * Actualiza la información del usuario en la base de datos según la información que se le envía
   *
   * @param payload: any
   * @return {*}  {Observable<IdentifyTokenOActualizarUsuario>}
   * @memberof AuthService
   */
  public actualizarUsuario(
    payload: ActualizarUsuarioReq
  ): Observable<IdentifyTokenOActualizarUsuario> {
    return this.httpClient.post<IdentifyTokenOActualizarUsuario>(
      `${environment.API_BASE_URL}/users/profile`,
      payload,
      { headers: this.headers }
    );
  }

  /**
   * Cierra sesión
   *
   * @return {*}  void
   * @memberof AuthService
   */
  public logout(): void {
    localStorage.removeItem('access-token');
    window.location.reload();
  }

  /**
   * Retorna el usuario logueado;
   *
   * @return {*}  User
   * @memberof AuthService
   */
  public getUser(): User {
    return this._loggedUser;
  }

  /**
   * Setea la información en el usuario
   *
   * @param user: User
   * @memberof AuthService
   */
  public setUser(user: User): void {
    this._loggedUser = user;
  }
}
