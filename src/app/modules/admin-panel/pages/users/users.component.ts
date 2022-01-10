import { Component, Host, HostBinding, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { UsersService } from '../../services/users.service';
import Swal from 'sweetalert2';
import { AllUsersRes, FullUser } from '../../interfaces/users.interface';
import { environment } from 'src/environments/environment';
import { CuerpoTabla } from '../../interfaces/tabla.interface';
import { Router } from '@angular/router';
import { AdminPanelCrudService } from '../../services/admin-panel-crud.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { userRole } from '../../../main/interfaces/http/auth.interface';
import { AuthService } from '../../../main/services/auth.service';
import {
  customMessageAlert,
  alertFailureOrSuccessOnCRUDAction,
  noConnectionAlert,
  unknownErrorAlert,
} from '../../../../helpers/alerts';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  @HostBinding('class.admin-panel-container') someClass: Host = true;

  public users: User[] = [];
  public tableData: CuerpoTabla[] = [];
  public encabezadosTabla: string[] = ['Nombre', 'Email', 'Teléfono', 'Rol'];
  public editRoleForm!: FormGroup;
  public isEditingRole: boolean = false;
  private userID!: number;
  private destroy$: Subject<boolean> = new Subject();

  public get activeUserRole(): userRole {
    return this.authService.getUser().role;
  }

  constructor(
    private usersService: UsersService,
    private router: Router,
    private adminPanelCrudService: AdminPanelCrudService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.createForm();
  }

  private createForm(): void {
    this.editRoleForm = this.fb.group({
      role: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  public formSubmit(): void {
    this.editRoleForm.valid
      ? this.changeRoleEnLaDb()
      : this.editRoleForm.markAllAsTouched();
  }

  public loadUsers(): void {
    this.usersService
      .getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: AllUsersRes) => {
          if (res.meta.status.toString().includes('20')) {
            this.setUsers(res);
            this.mapUsersForTable();
          } else {
            unknownErrorAlert(res);
          }
        },
        (err) => noConnectionAlert(err)
      );
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
      this.isEditingRole = false;
      this.loadUsers();
    }
  }

  public crearUsuario() {
    this.router.navigateByUrl('/main/auth/register');
  }

  public changeRole(id: number): void {
    if (this.verificarNiverDeUsuario()) {
      const usuarioSeleccionado = this.users.find((user) => user.id === id);
      if (usuarioSeleccionado) {
        if (usuarioSeleccionado.role === 'master') {
          customMessageAlert(
            'Prohibido',
            'El rol de este usuario no se puede editar',
            'OK',
            'warning'
          );
          return;
        }

        this.isEditingRole = true;
        this.userID = usuarioSeleccionado.id;
        this.editRoleForm.controls.role.setValue(usuarioSeleccionado.role);
      }
    }
  }

  private changeRoleEnLaDb(): void {
    this.adminPanelCrudService
      .editUserRole(this.userID, this.editRoleForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.recargarUsuarios(true);
          alertFailureOrSuccessOnCRUDAction(res, 'editó', 'usuario');
        },
        (err) => {
          this.recargarUsuarios(true);
          noConnectionAlert(err);
        }
      );
  }

  public borrarUSuario(id: number): void {
    if (this.verificarNiverDeUsuario()) {
      const selectedUser = this.users.find((user) => user.id === id);

      if (selectedUser) {
        if (selectedUser?.role === 'master') {
          customMessageAlert(
            'Prohibido',
            'Este usuario no se puede borrar',
            'OK',
            'warning'
          );
          return;
        }

        Swal.fire({
          title: '¿Estas seguro?',
          text: `Estas a punto de borrar al usuario: ${selectedUser?.nombre} ${selectedUser?.apellido}`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Si',
          cancelButtonText: 'No',
        }).then((result) => {
          if (result.isConfirmed) {
            this.borrarUsuarioDeLaDb(selectedUser);
          }
        });
      }
    }
  }

  private borrarUsuarioDeLaDb(selectedUser: User) {
    this.adminPanelCrudService
      .delete(selectedUser?.id!, 'users')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () =>
          this.showConfirmationOfDelete(
            `${selectedUser?.nombre} ${selectedUser?.apellido}`
          ),
        (err) => noConnectionAlert(err)
      );
  }

  private verificarNiverDeUsuario(): boolean {
    if (this.activeUserRole === 'master') {
      return true;
    } else {
      Swal.fire(
        'No permitido',
        'No tenés los permisos para realizar esa acción. Comunicate con el dueño de la página',
        'warning'
      );
      return false;
    }
  }

  private showConfirmationOfDelete(name: string): void {
    Swal.fire({
      title: 'Eliminado',
      text: `El usuario ${name} fue eliminado con éxito`,
      icon: 'success',
      confirmButtonText: 'OK',
    }).then((result) => {
      if (result.isConfirmed) {
        this.recargarUsuarios(true);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
