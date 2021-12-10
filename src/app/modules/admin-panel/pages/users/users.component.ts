import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { UsersService } from '../../services/users.service';
import Swal from 'sweetalert2';
import { AllUsersRes } from '../../interfaces/users.interface';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  public totalUsers: number = 0;
  public users: User[] = [];
  private from: number = 0;
  public loading: boolean = true;
  public pagination!: number;
  public searching: boolean = false;
  public searchingResults: number = 0;
  private destroy$: Subject<boolean> = new Subject();

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
    // this.modalImgSrv.showUploadedImage
    //   .pipe(delay(500))
    //   .subscribe((img) => this.loadUsers());
  }

  public loadUsers(): void {
    this.loading = true;
    this.usersService
      .getAllUsers()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res: AllUsersRes) => {
        this.searchingResults = 0;
        this.users = res?.data?.map(user => {
          return {
            apellido: user.last_name,
            email: user.email,
            nombre: user.first_name,
            role: user.role,
            phone: user.phone,
            avatar: user.avatar,
            getAvatar!: () => {
              let imageUrl = '';
              user.avatar ? imageUrl = `${environment.API_IMAGE_URL}/${user.avatar}` : imageUrl = `assets/no-image.png`;
              return imageUrl;
            }
          }
        })
        this.totalUsers = this.users.length;

      });
  }

  changePage(value: number): void {
    this.from += value;

    if (this.from < 0) {
      this.from = 0;
    } else if (this.from > this.totalUsers) {
      this.from -= value;
    }

    this.loadUsers();
  }

  public searchUsers(term: string): void {
    this.searching = true;
    if (!term) {
      this.loadUsers();
      this.searching = false;
      return;
    }
    // this.search.search('usuarios', term).subscribe((res: Search) => {
    //   this.users = res?.resultados as User[];
    //   this.searchingResults = res?.resultados?.length;
    // });
  }

  public deleteUser(user: User): void {
    // if (user.uid === this.users.usuario.uid) {
    //   Swal.fire('Error', 'You can t delete yourself', 'error');
    //   return;
    // }

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete user: ${user.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        // this.usersSrv.deleteUser(user.uid).subscribe(() => {
        //   this.showConfirmationOfDelete(user.nombre);
        // });
      }
    });
  }

  private showConfirmationOfDelete(name: string): void {
    Swal.fire({
      title: 'Deleted',
      text: `User ${name} has been succesfully deleted`,
      icon: 'success',
      confirmButtonText: 'OK',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadUsers();
      }
    });
  }

  changeRole(user: User) {
    // this.usersService.updateUserFromAdminPanel(user).subscribe(
    //   (res: UpdateUserResponseFromAdminPanel) => null,
    //   (err) => Swal.fire('Error', 'Could not update the user', 'error')
    // );
  }

  public openModal(user: User): void {
    // this.modalImgSrv.showModal('usuarios', user.uid, user.img);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
