import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';
import { Observable } from 'rxjs';
import { userRole } from '../../main/interfaces/http/auth.interface';
import { User } from 'src/app/models/user.model';
import { UserStoreService } from 'src/app/services/user-store.service';

@Injectable({
  providedIn: 'root',
})
export class MasterGuard implements CanActivate, CanLoad {
  private user: Observable<User>;
  private userRole!: userRole;

  constructor(private router: Router, private userStore: UserStoreService) {
    this.user = this.userStore.loggedUser$;
    this.user.subscribe((res) => {
      if (res.role) {
        this.userRole = res.role;
      }
    });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (localStorage.getItem('access-token') && this.userRole !== 'master') {
      this.router.navigateByUrl('admin/');
      return false;
    }
    return true;
  }
  canLoad(route: Route, segments: UrlSegment[]): boolean {
    if (localStorage.getItem('access-token') && this.userRole !== 'master') {
      this.router.navigateByUrl('admin/');
      return false;
    }
    return true;
  }
}
