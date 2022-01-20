import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../../../models/user.model';
import { UserStoreService } from '../../../../services/user-store.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public user: User | undefined;

  constructor(private userStore: UserStoreService) {
    this.userStore.loggedUser$.subscribe((res) => {
      res.id ? (this.user = res) : (this.user = undefined);
    });
  }
}
