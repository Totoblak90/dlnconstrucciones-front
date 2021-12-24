import { Component, Host, HostBinding, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { UsersService } from '../../services/users.service';
import Swal from 'sweetalert2';
import { AllUsersRes, FullUser } from '../../interfaces/users.interface';
import { environment } from 'src/environments/environment';
import { CuerpoTabla } from '../../interfaces/tabla.interface';
import { Router } from '@angular/router';
import { AuthService } from '../../../main/services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  @HostBinding('class.admin-panel-container') someClass: Host = true;

  public users: User[] = [];
  public tableData: CuerpoTabla[] = [];
  public loading: boolean = true;
  private destroy$: Subject<boolean> = new Subject();

  public get encabezadosTabla(): string[] {
    const enc: string[] = ['Nombre', 'Email', 'Teléfono', 'Rol'];
    return enc;
  }

  constructor(
    private usersService: UsersService,
    private router: Router,
    private authService: AuthService
  ) {}

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
    this.users = data?.data?.map((user: FullUser) => {
      return {
        id: user.id,
        apellido: user.last_name,
        email: user.email,
        nombre: user.first_name,
        dni: user.dni!,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        project: user.Projects,
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
        id: user.id,
      };
    });
  }

  public recargarUsuarios(recargar: boolean): void {
    if (recargar) {
      this.tableData = [];
      this.loadUsers();
    }
  }

  public crearUsuario() {
    this.router.navigateByUrl('/main/auth/register');
  }

  public borrarUSuario(id: number): void {
    const selectedUser = this.users.find((user) => user.id === id);

    if (selectedUser?.role === 'master') {
      Swal.fire(
        'Error',
        `¡${selectedUser.nombre}, no podés borrarte a vos mismo CABALLO!`,
        'error'
      );
      return;
    }

    Swal.fire({
      title: '¿Estas seguro?',
      text: `Estas a punto de borrar al usuario: ${selectedUser?.nombre} ${selectedUser?.apellido}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      // if (result.isConfirmed) {
      //   this.usersService.deleteUser(selectedUser).subscribe(() => {
      //     this.showConfirmationOfDelete(selectedUser?.nombre!);
      //   });
      // }
    });
  }

  private showConfirmationOfDelete(name: string): void {
    Swal.fire({
      title: 'Eliminado',
      text: `El usuario ${name} fue eliminado con éxito`,
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
