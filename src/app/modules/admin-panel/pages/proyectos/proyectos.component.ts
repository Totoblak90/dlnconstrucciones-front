import { Component, Host, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal, { SweetAlertResult, SweetAlertIcon } from 'sweetalert2';
import { FullUser, Project } from '../../interfaces/users.interface';
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
import { CreateOrEditProyectReq } from '../../interfaces/projects.interface';
import { CashflowsService } from '../../services/cashflows.service';
import { Cashflow } from '../../interfaces/cashflows.interface';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn bgc-primary-dark text-white',
    cancelButton: 'btn btn-danger',
  },
  buttonsStyling: false,
});

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
  public cashflows: Cashflow[] = [];
  public tableData: CuerpoTabla[] = [];
  public encabezadosTabla: string[] = [
    'Nombre del proyecto',
    'Anotaciones',
    'Moneda del proyecto',
    'Total',
    'Debe',
    'Archivos',
    'Usuario',
  ];
  public isCreating: boolean = false;
  public isEditing: boolean = false;
  public crudAction: string = '';
  public proyectForm!: FormGroup;
  public fileToUpload: File | null = null;
  public acceptedFileTypes: boolean = true;
  public projectID!: number;
  public formatosNoAceptadosEnEditarCashflow: boolean = false;
  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private adminPanelCrudService: AdminPanelCrudService,
    private currencyPipe: CurrencyPipe,
    private fb: FormBuilder,
    private router: Router,
    private projectService: ProjectsService,
    private usersService: UsersService,
    private cashflowService: CashflowsService
  ) {
    this.createForm();
  }

  private createForm(): void {
    this.proyectForm = this.fb.group({
      title: [undefined, [Validators.required, Validators.minLength(6)]],
      description: ['', [Validators.minLength(10), Validators.required]],
      total: [null, [Validators.required, Validators.min(0)]],
      cashflow: [undefined],
      coin: [null, Validators.required],
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
      const proyectReq: CreateOrEditProyectReq = {
        coin: this.proyectForm.controls.coin.value,
        description: this.proyectForm.controls.description?.value,
        title: this.proyectForm.controls.title?.value,
        total: +this.proyectForm.controls.total?.value,
        user: this.proyectForm.controls.user?.value!,
      };

      this.crudAction === 'Crear'
        ? this.crearProyectoEnLaDb(proyectReq)
        : this.editarProyectoEnLaDb(proyectReq);
    }
  }

  public validateCashflowExtension(e: any): void {
    const file: File = e.target?.files[0];

    this.acceptedFileTypes =
      file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/pdf' ||
      file.type === 'application/msword' ||
      file.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'image/jpg' ||
      file.type === 'image/jpeg' ||
      file.type === 'image/png';

    this.acceptedFileTypes
      ? (this.fileToUpload = file)
      : (this.fileToUpload = null);
  }

  private getProyects(projectID?: number): void {
    this.projectService
      .getAllProjects()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          if (res?.meta?.status.toString().includes('20')) {
            this.projects = res?.data;
            this.projects.forEach((p) => {
              if (projectID) {
                if (p.id === projectID) {
                  this.cashflows = p.Cashflows!;
                }
              } else {
                this.cashflows = p.Cashflows!;
              }
            });
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
        item4: proyecto.coin.toString(),
        item6: proyecto.total ? this.setCurrencyFormat(proyecto.total) : 'NULL',
        item7:
          proyecto.balance !== null || proyecto.balance !== undefined
            ? this.setCurrencyFormat(proyecto.balance)
            : 'NULL',
        item8: proyecto.Cashflows?.length.toString(),
        item9: `${proyecto.Users?.first_name} ${proyecto.Users?.last_name}`,
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
    this.proyectForm.controls.coin?.setValue('');
  }

  public crearProyecto(): void {
    this.crudAction = 'Crear';
    this.isCreating = true;
    this.isEditing = false;
  }

  public crearProyectoEnLaDb(formData: CreateOrEditProyectReq): void {
    this.adminPanelCrudService
      .createWithJSON(formData, 'projects')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          if (this.fileToUpload) {
            this.createCashflow(res.data.id);
          } else {
            this.recargarProyectos(true);
            alertFailureOrSuccessOnCRUDAction(res, 'creó', 'proyecto');
          }
        },
        (err) => {
          this.recargarProyectos(true);
          noConnectionAlert(err);
        }
      );
  }

  public createCashflow(projectID: number): void {
    const formData = new FormData();
    formData.append('cashflow', this.fileToUpload!);
    formData.append('projects_id', projectID.toString());

    this.cashflowService
      .createCashflow(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.recargarProyectos(true);
          swalWithBootstrapButtons.fire(
            '¡Excelente!',
            'El proyecto y el archivo se crearon correctamente',
            'success'
          );
        },
        error: (err) => {
          this.recargarProyectos(true);
          swalWithBootstrapButtons.fire(
            'Malas noticias!',
            'El proyecto se creó correctamente pero el archivo no se pudo guardar como esperabamos ;(',
            'error'
          );
        },
      });
  }

  public editarProyecto(id: number): void {
    this.crudAction = 'Editar';
    this.isEditing = true;
    this.isCreating = false;
    const proyecto: Project | undefined = this.projects.find(
      (proj) => proj.id === id
    );
    this.cashflows = proyecto?.Cashflows!;
    if (proyecto) {
      this.formatosNoAceptadosEnEditarCashflow = false;
      this.projectID = id;
      this.proyectForm.controls.title.setValue(proyecto.title);
      this.proyectForm.controls.description.setValue(proyecto.description);
      this.proyectForm.controls.total.setValue(proyecto.total);
      // Saco los decimales del total para mostrar el input ---------------------
      this.proyectForm.controls.total.setValue(
        this.proyectForm.controls.total.value.substring(
          0,
          this.proyectForm.controls.total.value.length - 3
        )
      );
      // ------------------------------------------------------------------------
      this.proyectForm.controls.user.setValue(proyecto.Users?.id);
      this.proyectForm.controls.coin.setValue(proyecto.coin);
    }
  }

  public editarProyectoEnLaDb(formData: CreateOrEditProyectReq): void {
    this.adminPanelCrudService
      .editWthJSON(this.projectID, formData, 'projects')
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

  public addCashflowOnEdit(projectID: number, input: HTMLInputElement): void {
    if (input.files?.length) {
      const acceptedFileTypes =
        input.files[0].type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        input.files[0].type === 'application/pdf' ||
        input.files[0].type === 'application/msword' ||
        input.files[0].type ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        input.files[0].type === 'application/vnd.ms-excel' ||
        input.files[0].type === 'image/jpg' ||
        input.files[0].type === 'image/jpeg' ||
        input.files[0].type === 'image/png';

      const formData = new FormData();
      formData.append('projects_id', projectID.toString());
      formData.append('cashflow', input.files ? input.files[0] : '');

      if (acceptedFileTypes) {
        this.formatosNoAceptadosEnEditarCashflow = false;
        this.cashflowService
          .createCashflow(formData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res) => {
              this.getProyects(projectID);
              alertFailureOrSuccessOnCRUDAction(res, 'creó', 'cashflow');
            },
            error: (err) => {
              alertFailureOrSuccessOnCRUDAction(err, 'creó', 'cashflow');
            },
          });
      } else {
        this.formatosNoAceptadosEnEditarCashflow = true;
      }
    }
  }

  public editSelectedCashflow(
    input: HTMLInputElement,
    cashflowId: number
  ): void {
    if (input.files?.length) {
      const acceptedFileTypes =
        input.files[0].type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        input.files[0].type === 'application/pdf' ||
        input.files[0].type === 'application/msword' ||
        input.files[0].type ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        input.files[0].type === 'application/vnd.ms-excel' ||
        input.files[0].type === 'image/jpg' ||
        input.files[0].type === 'image/jpeg' ||
        input.files[0].type === 'image/png';

      const formData = new FormData();
      formData.append('projects_id', this.projectID.toString());
      formData.append('cashflow', input.files ? input.files[0] : '');

      if (acceptedFileTypes) {
        this.formatosNoAceptadosEnEditarCashflow = false;
        this.cashflowService
          .editCashflow(formData, cashflowId)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res) => {
              this.getProyects(this.projectID);
              alertFailureOrSuccessOnCRUDAction(res, 'editó', 'cashflow');
            },
            error: (err) =>
              alertFailureOrSuccessOnCRUDAction(err, 'editó', 'cashflow'),
          });
      } else {
        this.formatosNoAceptadosEnEditarCashflow = true;
      }
    }
  }

  public deleteCashflow(cashflowId: number): void {
    this.cashflowService
      .deleteCashflow(cashflowId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.getProyects(this.projectID);
          alertFailureOrSuccessOnCRUDAction(res, 'borró', 'cashflow');
        },
        error: (err) =>
          alertFailureOrSuccessOnCRUDAction(err, 'borró', 'cashflow'),
      });
  }

  public setImageIconOnEditCashflow(filename: string): string {
    if (filename.includes('.pdf')) return '../../../../../assets/pdficon.png';
    else if (filename.includes('.xls') || filename.includes('.xlsx'))
      return '../../../../../assets/excelicon.png';
    else if (filename.includes('.doc') || filename.includes('.docx'))
      return '../../../../../assets/word.png';
    else if (
      filename.includes('.png') ||
      filename.includes('.jpg') ||
      filename.includes('.jpeg')
    )
      return '../../../../../assets/mediafile.png';

    return '';
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
