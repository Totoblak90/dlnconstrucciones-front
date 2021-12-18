import { Component, Host, HostBinding, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { UsersService } from '../../services/users.service';
import Swal from 'sweetalert2';
import { AllUsersRes } from '../../interfaces/users.interface';
import { environment } from 'src/environments/environment';
import { CuerpoTabla } from '../../interfaces/tabla.interface';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  @HostBinding('class.admin-panel-container') someClass: Host = true;

  public users: User[] = [];
  public encabezadosTabla: string[] = ['Nombre', 'Email', 'Teléfono', 'Rol'];
  public tableData: CuerpoTabla[] = [];
  public loading: boolean = true;
  private destroy$: Subject<boolean> = new Subject();

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  public loadUsers(): void {
    this.loading = true;
    this.usersService
      .getAllUsers()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res: AllUsersRes) => {
        this.setUsers(res);
        this.mapUsersForTable();
      });
  }

  private setUsers(data: AllUsersRes): void {
    this.users = data?.data?.map((user) => {
      return {
        apellido: user.last_name,
        email: user.email,
        nombre: user.first_name,
        dni: user.dni!,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        getAvatar: () => {
          let imageUrl = '';
          user.avatar
            ? (imageUrl = `${environment.API_IMAGE_URL}/users/${user.avatar}`)
            : (imageUrl = `assets/no-image.png`);
          return imageUrl;
        },
      };
    });
  }

  private mapUsersForTable() {
    this.tableData = this.users.map((user) => {
      return {
        imagen: user.getAvatar(),
        item2: `${user.nombre} ${user.apellido}`,
        item3: user.email ? user.email : 'Vacío',
        item4: user.phone ? user.phone : 'Vacío',
        item6: user.role ? user.role : 'Vacío',
        id: 1
      };
    });
  }

  public recargarUsuarios(recargar: boolean): void {
    if (recargar) {
      this.tableData = [];
      this.loadUsers();
    }
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
