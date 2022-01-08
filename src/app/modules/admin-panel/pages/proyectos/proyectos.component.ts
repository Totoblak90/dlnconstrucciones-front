import { Component, Host, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { UsersService } from '../../services/users.service';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { Project } from '../../interfaces/users.interface';
import { CuerpoTabla } from '../../interfaces/tabla.interface';
import { AdminPanelCrudService } from '../../services/admin-panel-crud.service';
import { CurrencyPipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss'],
})
export class ProyectosComponent implements OnInit, OnDestroy {
  @HostBinding('class.admin-panel-container') someClass: Host = true;

  public projects: Project[] = [];
  public tableData: CuerpoTabla[] = [];
  public encabezadosTabla: string[] = [
    'Nombre del proyecto',
    'Anotaciones',
    'Total',
    'Debe',
    'Usuario',
  ];
  public loading: boolean = true;
  public isCreating: boolean = false;
  public isEditing: boolean = false;
  public crudAction: string = '';
  public proyectForm!: FormGroup;
  public fileToUpload: File | null = null;
  public acceptedFileTypes: boolean = true;
  public projectID!: number;

  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private usersService: UsersService,
    private adminPanelCrudService: AdminPanelCrudService,
    private currencyPipe: CurrencyPipe,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.createForm();
  }

  private createForm(): void {
    this.proyectForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(6)]],
      description: ['', [Validators.minLength(6)]],
      total: [null, [Validators.required, Validators.min(0)]],
      cashflow: [null],
      user: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getProyects();
  }

  public formSubmit(): void {
    this.proyectForm.markAllAsTouched();
    if (this.proyectForm.valid) {
      const formData: FormData = new FormData();
      formData.append('title', this.proyectForm.controls.title?.value);
      formData.append(
        'description',
        this.proyectForm.controls.description?.value
      );
      formData.append('total', this.proyectForm.controls.total?.value);
      formData.append('cashflow', this.fileToUpload!);
      formData.append('user', this.proyectForm.controls.user?.value!);

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
    this.usersService
      .getAllProjects()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (res) => {
          if (res?.meta?.status.toString().includes('20')) {
            this.projects = res?.data;
            this.setTableData();
          } else {
            Swal.fire(
              '¡Lo sentimos!',
              'No pudimos cargar la información, por favor recarga la página',
              'error'
            );
          }
        },
        () =>
          Swal.fire(
            '¡Lo sentimos!',
            'No pudimos cargar la información, por favor recarga la página',
            'error'
          )
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
        item7: `${proyecto.Users?.first_name} ${proyecto.Users?.last_name}`,
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
          console.log(res);
          this.recargarProyectos(true);
          this.alertFailureOrSuccess(res?.meta?.status);
        },
        (err) => {
          console.log(err);
          this.recargarProyectos(true);
          Swal.fire(
            'Error',
            'No pudimos crear el proyecto, por favor intentá de nuevo recargando la página',
            'error'
          );
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
          this.alertFailureOrSuccess(res?.meta?.status);
        },
        () => {
          this.recargarProyectos(true);
          Swal.fire(
            'Error',
            'Tuvimos un error desconocido, por favor intenta recargar la página o espera un rato.',
            'error'
          );
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
          this.alertFailureOrSuccess(res?.meta?.status);
        },
        () => {
          Swal.fire(
            '¡Lo sentimos!',
            'No pudimos realizar el pedido correctamente, por favor actualizá la página e intentá de nuevo',
            'error'
          );
        }
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
