import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from '../services/auth.service';
import { UserStoreService } from '../../../services/user-store.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileGuard implements CanActivate, CanLoad {
  private user: User | undefined;
  constructor(private router: Router, private userStore: UserStoreService) {
    this.userStore.loggedUser$.subscribe((res) =>
      res.id ? (this.user = res) : (this.user = undefined)
    );
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (localStorage.getItem('access-token') && this.user) {
      return true;
    }
    this.router.navigate(['main', 'home']);
    return false;
  }
  canLoad(route: Route, segments: UrlSegment[]): boolean {
    if (localStorage.getItem('access-token') && this.user) {
      return true;
    }
    this.router.navigate(['main', 'home']);
    return false;
  }
}
