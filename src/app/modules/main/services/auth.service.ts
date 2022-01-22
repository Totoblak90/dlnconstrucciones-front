import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../../../models/user.model';
import {
  ActualizarUsuarioReq,
  IdentifyTokenOActualizarUsuario,
  LoginForm,
  LoginRes,
  RegisterForm,
  RegisterRes,
  RestablecerConstraseniaFirstStep,
  RestablecerContraseniaExitoso,
} from '../interfaces/http/auth.interface';
import { getToken } from '../helpers/functions.helper';
import { Router } from '@angular/router';
import { RestablecerContraseniaLastStep } from '../interfaces/http/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

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
   * Crea un usuario en la base de datos con la data que se le envía
   *
   * @param payload: RegisterForm
   * @return {*}  {Observable<RegisterRes>}
   * @memberof AuthService
   */
  public registerSiendoMaster(payload: RegisterForm): Observable<RegisterRes> {
    return this.httpClient.post<RegisterRes>(
      `${environment.API_BASE_URL}/users/enroll`,
      payload,
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
    );
  }

  /**
   * Actualiza la imágen del usuario
   *
   * @param avatar: File
   * @return {*}  {Observable<IdentifyTokenOActualizarUsuario>}
   * @memberof AuthService
   */
  public actualizarImagenUsuario(
    formData: FormData
  ): Observable<IdentifyTokenOActualizarUsuario> {
    return this.httpClient.post<IdentifyTokenOActualizarUsuario>(
      `${environment.API_BASE_URL}/users/avatar`,
      formData,
    );
  }

  /**
   * Restablecer constraseña
   *
   * @param email:
   * @return {*}  {Observable<any>}
   * @memberof AuthService
   */
  public restablecerContrasenia(
    email: RestablecerConstraseniaFirstStep
  ): Observable<any> {
    return this.httpClient.post<any>(
      `${environment.API_BASE_URL}/users/forgotpass`,
      email
    );
  }

  /**
   * Genera una nueva contraseña
   *
   * @param payload: RestablecerContraseniaLastStep
   * @return {*}  {Observable<RestablecerContraseniaExitoso>}
   * @memberof AuthService
   */
  public guardarNuevaContrasenia(
    payload: RestablecerContraseniaLastStep
  ): Observable<RestablecerContraseniaExitoso> {
    return this.httpClient.post<RestablecerContraseniaExitoso>(
      `${environment.API_BASE_URL}/users/newpass`,
      payload
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
}
