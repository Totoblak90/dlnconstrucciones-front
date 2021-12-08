import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileGuard implements CanActivate, CanLoad {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.getUser()) {
      return true;
    }
    this.router.navigate(['home']);
    return false;
  }
  canLoad(route: Route, segments: UrlSegment[]): boolean {
    if (this.authService.getUser()) {
      return true;
    }
    this.router.navigate(['home']);
    return false;
  }
}
