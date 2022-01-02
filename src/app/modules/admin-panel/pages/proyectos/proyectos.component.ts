import { Component, Host, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { UsersService } from '../../services/users.service';
import Swal, { SweetAlertResult } from 'sweetalert2';
import {
  AllUsersRes,
  FullUser,
  Project,
} from '../../interfaces/users.interface';
import { environment } from 'src/environments/environment';
import { CuerpoTabla } from '../../interfaces/tabla.interface';
import { Router } from '@angular/router';
import { AdminPanelCrudService } from '../../services/admin-panel-crud.service';
import { CurrencyPipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
    'Total',
    'Debe',
    'Usuario',
  ];
  public loading: boolean = true;
  public isCreating: boolean = false;
  public isEditing: boolean = false;
  public crudAction: string = '';
  public interestForm!: FormGroup;
  public imageToShow: string = '../../../../../assets/no-image.png';
  public fileToUpload?: File;
  public acceptedFileTypes: boolean = true;
  public projectID!: number;

  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private usersService: UsersService,
    private adminPanelCrudService: AdminPanelCrudService,
    private currencyPipe: CurrencyPipe,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  private createForm(): void {
    this.interestForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(6)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      image: [''],
    });
  }

  ngOnInit(): void {
    this.getProyects();
  }

  public formSubmit(): void {
    this.interestForm.markAllAsTouched();
    if (this.interestForm.valid) {
      const formData: FormData = new FormData();
      formData.append('title', this.interestForm.controls.title?.value);
      formData.append(
        'description',
        this.interestForm.controls.description?.value
      );
      formData.append('image', this.fileToUpload!);

      this.crudAction === 'Crear'
        ? this.crearInteresEnLaDb(formData)
        : this.editarInteresEnLaDb(formData);
    }
  }

  public showSelectedImage(e: any) {
    const file = e.target?.files[0];

    this.acceptedFileTypes =
      file.type === 'image/jpg' ||
      file.type === 'image/jpeg' ||
      file.type === 'image/png';

    if (file && this.acceptedFileTypes) {
      this.fileToUpload = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => (this.imageToShow = reader.result as string);
    } else {
      this.imageToShow = '../../../../../assets/no-image.png';
    }
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
    this.projects.forEach((proyecto) =>
      this.tableData.push({
        imagen: '../../../../../assets/no-image.png',
        id: proyecto.id,
        item2: proyecto.title
          ? proyecto.title
          : `Proyecto usuario: ${proyecto.Users?.first_name} ${proyecto.Users?.last_name}`,
        item3: proyecto.total ? this.setCurrencyFormat(proyecto.total) : 'NULL',
        item4:
          proyecto.balance !== null || proyecto.balance !== undefined
            ? this.setCurrencyFormat(proyecto.balance)
            : 'NULL',
        item6: `${proyecto.Users?.first_name} ${proyecto.Users?.last_name}`,
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
      this.isCreating = false;
      this.isEditing = false;
      this.getProyects();
    }
  }

  private resetsetControls(): void {
    this.interestForm.controls.title.setValue('');
    this.interestForm.controls.description.setValue('');
    this.interestForm.controls.image.setValue('');
    this.imageToShow = '../../../../../assets/no-image.png';
  }

  public crearInteres(): void {
    this.crudAction = 'Crear';
    this.isCreating = true;
    this.isEditing = false;
  }

  public crearInteresEnLaDb(formData: FormData): void {
    this.adminPanelCrudService
      .create(formData, 'interests')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.recargarProyectos(true);
          this.alertFailureOrSuccess(res?.meta?.status);
        },
        () => {
          this.recargarProyectos(true);
          Swal.fire(
            'Error',
            'No pudimos crear el interés, por favor intentá de nuevo recargando la página',
            'error'
          );
        }
      );
  }

  public editarInteres(id: number): void {
    this.crudAction = 'Editar';
    this.isEditing = true;
    this.isCreating = false;
    const proyecto = this.projects.find((proj) => proj.id === id);
    if (proyecto) {
      this.projectID = id;
      this.interestForm.controls.title.setValue(proyecto.title);
    }
  }

  public editarInteresEnLaDb(formData: FormData): void {
    this.adminPanelCrudService
      .edit(this.projectID, formData, 'interests')
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

  public borrarInteres(id: number): void {
    Swal.fire({
      title: '¿Seguro querés elimninar el trabajo seleccionado?',
      showDenyButton: true,
      confirmButtonText: 'Si, borrar',
      denyButtonText: `No`,
    }).then((result: SweetAlertResult<any>) => {
      result.isConfirmed ? this.borrarInteresesDeLaDb(id) : null;
    });
  }
  public borrarInteresesDeLaDb(id: number): void {
    this.adminPanelCrudService
      .delete(id, 'interests')
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

  private alertFailureOrSuccess(status: number): void {
    if (status === 200 || status === 201) {
      Swal.fire('¡Excelente!', 'La zona se creó correctamente', 'success');
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
