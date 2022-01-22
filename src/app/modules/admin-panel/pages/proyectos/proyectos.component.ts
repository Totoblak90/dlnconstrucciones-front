import { Component, Host, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal, { SweetAlertResult } from 'sweetalert2';
import {
  AllUsersRes,
  FullUser,
  Project,
} from '../../interfaces/users.interface';
import { CuerpoTabla } from '../../interfaces/tabla.interface';
import { AdminPanelCrudService } from '../../services/admin-panel-crud.service';
import { CurrencyPipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectsService } from '../../services/projects.service';
import { UsersService } from '../../services/users.service';
import {
  alertFailureOrSuccessOnCRUDAction,
  noConnectionAlert,
  unknownErrorAlert,
} from '../../../../helpers/alerts';

type UserSelectData = Pick<
  FullUser,
  'id' | 'first_name' | 'last_name' | 'email'
>;

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss'],
})
export class ProyectosComponent implements OnInit, OnDestroy {
  @HostBinding('class.admin-panel-container') someClass: Host = true;

  public selectData: UserSelectData[] = [];
  public projects: Project[] = [];
  public tableData: CuerpoTabla[] = [];
  public encabezadosTabla: string[] = [
    'Nombre del proyecto',
    'Anotaciones',
    'Total',
    'Debe',
    'Cashflow',
    'Usuario',
  ];
  public isCreating: boolean = false;
  public isEditing: boolean = false;
  public crudAction: string = '';
  public proyectForm!: FormGroup;
  public fileToUpload: File | null = null;
  public acceptedFileTypes: boolean = true;
  public projectID!: number;

  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private adminPanelCrudService: AdminPanelCrudService,
    private currencyPipe: CurrencyPipe,
    private fb: FormBuilder,
    private router: Router,
    private projectService: ProjectsService,
    private usersService: UsersService
  ) {
    this.createForm();
  }

  private createForm(): void {
    this.proyectForm = this.fb.group({
      title: [undefined, [Validators.required, Validators.minLength(6)]],
      description: ['', [Validators.minLength(10)]],
      total: [null, [Validators.required, Validators.min(0)]],
      cashflow: [undefined],
      user: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getProyects();
    this.getSelectData();
  }

  private getSelectData(): void {
    this.usersService
      .getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          res?.data?.forEach((user: FullUser) => {
            const data: UserSelectData = {
              id: user.id,
              email: user.email,
              first_name: user.first_name,
              last_name: user.last_name,
            };
            this.selectData.push(data);
          });
        },
        error: (err) => unknownErrorAlert(err),
      });
  }

  public formSubmit(): void {
    this.proyectForm.markAllAsTouched();
    if (this.proyectForm.valid) {
      const formData: FormData = new FormData();
      formData.append('title', this.proyectForm.controls.title?.value);
      formData.append('total', this.proyectForm.controls.total?.value);
      formData.append('user', this.proyectForm.controls.user?.value!);

      this.fileToUpload
        ? formData.append('cashflow', this.fileToUpload!)
        : null;

      this.proyectForm.controls.description?.value
        ? formData.append(
            'description',
            this.proyectForm.controls.description?.value
          )
        : null;

      this.crudAction === 'Crear'
        ? this.crearProyectoEnLaDb(formData)
        : this.editarProyectoEnLaDb(formData);
    }
  }

  public validateCashflowExtension(e: any): void {
    const file: File = e.target?.files[0];
    this.acceptedFileTypes =
      file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/pdf';

    this.acceptedFileTypes
      ? (this.fileToUpload = file)
      : (this.fileToUpload = null);
  }

  private getProyects(): void {
    this.projectService
      .getAllProjects()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          if (res?.meta?.status.toString().includes('20')) {
            this.projects = res?.data;
            this.setTableData();
          } else {
            unknownErrorAlert(res);
          }
        },
        (err) => noConnectionAlert(err)
      );
  }

  private setTableData(): void {
    this.projects.forEach((proyecto: Project) =>
      this.tableData.push({
        imagen: '../../../../../assets/no-image.png',
        id: proyecto.id,
        item2:
          proyecto.title ||
          `Proyecto usuario: ${proyecto.Users?.first_name} ${proyecto.Users?.last_name}`,
        item3: proyecto.description || '-',
        item4: proyecto.total ? this.setCurrencyFormat(proyecto.total) : 'NULL',
        item6:
          proyecto.balance !== null || proyecto.balance !== undefined
            ? this.setCurrencyFormat(proyecto.balance)
            : 'NULL',
        item7: proyecto.cashflow ? 'Si' : 'No',
        item8: `${proyecto.Users?.first_name} ${proyecto.Users?.last_name}`,
      })
    );
  }

  private setCurrencyFormat(total: number): string {
    return this.currencyPipe.transform(total, '$')!;
  }

  public recargarProyectos(recargar: boolean) {
    if (recargar) {
      this.resetsetControls();
      this.tableData = [];
      this.projects = [];
      this.isCreating = false;
      this.isEditing = false;
      this.getProyects();
    }
  }

  private resetsetControls(): void {
    this.proyectForm.controls.title?.setValue('');
    this.proyectForm.controls.total?.setValue('');
    this.proyectForm.controls.description?.setValue('');
    this.proyectForm.controls.user?.setValue('');
  }

  public crearProyecto(): void {
    this.crudAction = 'Crear';
    this.isCreating = true;
    this.isEditing = false;
  }

  public crearProyectoEnLaDb(formData: FormData): void {
    this.adminPanelCrudService
      .create(formData, 'projects')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.recargarProyectos(true);
          alertFailureOrSuccessOnCRUDAction(res, 'creó', 'proyecto');
        },
        (err) => {
          this.recargarProyectos(true);
          noConnectionAlert(err);
        }
      );
  }

  public editarProyecto(id: number): void {
    this.crudAction = 'Editar';
    this.isEditing = true;
    this.isCreating = false;
    const proyecto: Project | undefined = this.projects.find(
      (proj) => proj.id === id
    );
    if (proyecto) {
      this.projectID = id;
      this.proyectForm.controls.title.setValue(proyecto.title);
      this.proyectForm.controls.title.setValue(proyecto.description);
      this.proyectForm.controls.total.setValue(proyecto.total);
      this.proyectForm.controls.user.setValue(proyecto.Users?.id);
    }
  }

  public editarProyectoEnLaDb(formData: FormData): void {
    this.adminPanelCrudService
      .edit(this.projectID, formData, 'projects')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          this.recargarProyectos(true);
          alertFailureOrSuccessOnCRUDAction(res, 'editó', 'proyecto');
        },
        (err) => {
          this.recargarProyectos(true);
          noConnectionAlert(err);
        }
      );
  }

  public borrarProyecto(id: number): void {
    Swal.fire({
      title: '¿Seguro querés elimninar el proyecto seleccionado?',
      showDenyButton: true,
      confirmButtonText: 'Si, borrar',
      denyButtonText: `No`,
    }).then((result: SweetAlertResult<any>) => {
      result.isConfirmed ? this.borrarProyectoEnLaDb(id) : null;
    });
  }

  public borrarProyectoEnLaDb(id: number): void {
    this.adminPanelCrudService
      .delete(id, 'projects')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.recargarProyectos(true);
          alertFailureOrSuccessOnCRUDAction(res, 'borró', 'proyecto');
        },
        (err) => noConnectionAlert(err)
      );
  }

  public addPayment(projectId: number): void {
    this.router.navigateByUrl('/admin/proyectos/payments', {
      state: { id: projectId },
    });
  }

  public addAsset(projectId: number): void {
    this.router.navigateByUrl('/admin/proyectos/assets', {
      state: { id: projectId },
    });
  }

  private alertFailureOrSuccess(status: number): void {
    if (status === 200 || status === 201) {
      Swal.fire(
        '¡Excelente!',
        'El proyecto se eliminó correctamente',
        'success'
      );
    } else {
      Swal.fire(
        '¡Lo sentimos!',
        'No pudimos cargar la información, por favor recarga la página',
        'error'
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
