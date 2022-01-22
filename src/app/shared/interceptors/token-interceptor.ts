import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getToken } from '../../modules/main/helpers/functions.helper';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const userToken = getToken();
    const modifiedReq = req.clone({
      headers: req.headers.set('access-token', userToken),
    });
    return next.handle(modifiedReq);
  }
}
