import { Component, Host, HostBinding, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CuerpoTabla } from '../../interfaces/tabla.interface';
import { HttpService } from '../../../../services/http.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { TypesOfJobs } from 'src/app/modules/main/interfaces/http/jobs.interface';
import { environment } from 'src/environments/environment';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminPanelCrudService } from '../../services/admin-panel-crud.service';
import { TypesOfJobsData } from '../../../main/interfaces/http/jobs.interface';

@Component({
  selector: 'app-tipo-de-trabajo',
  templateUrl: './tipo-de-trabajo.component.html',
  styleUrls: ['./tipo-de-trabajo.component.scss'],
})
export class TipoDeTrabajoComponent implements OnInit {
  @HostBinding('class.admin-panel-container') someClass: Host = true;

  public encabezadosTabla: string[] = ['Título'];
  public tableData: CuerpoTabla[] = [];
  public loading: boolean = true;
  public tiposDeTrabajo: TypesOfJobsData[] = [];
  public tipoDeTrabajoForm!: FormGroup;
  public isEditing: boolean = false;
  public isCreating: boolean = false;
  public crudAction: string = '';
  public imageToShow: string = '../../../../../assets/no-image.png';
  public acceptedFileTypes: boolean = true;
  public tipoDeTrabajoID!: number;
  private destroy$: Subject<boolean> = new Subject();

  private fileToUpload!: File;

  constructor(
    private httpSrv: HttpService,
    private fb: FormBuilder,
    private adminPanelCrudService: AdminPanelCrudService
  ) {
    this.createForm();
  }

  private createForm(): void {
    this.tipoDeTrabajoForm = this.fb.group({
      image: [''],
      title: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.getTiposDeTrabajo();
  }

  private getTiposDeTrabajo(): void {
    this.httpSrv
      .getTypesOfJob()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (typesOfJob: TypesOfJobs) => {
          typesOfJob.data.forEach((typeOfJob) => {
            this.tableData.push({
              imagen: `${environment.API_IMAGE_URL}/${typeOfJob.image}`,
              item2: typeOfJob.title,
              id: typeOfJob.id,
            });
            this.tiposDeTrabajo.push(typeOfJob);
          });
        },
        () => {
          Swal.fire(
            'Error',
            'Tuvimos un error desconocido, por favor intenta recargar la página o espera un rato.',
            'error'
          );
        }
      );
  }

  public formSubmit(): void {
    this.tipoDeTrabajoForm.markAllAsTouched();
    if (this.tipoDeTrabajoForm.valid) {
      const formData: FormData = new FormData();
      formData.append('title', this.tipoDeTrabajoForm.controls.title?.value);
      formData.append('image', this.fileToUpload!);

      this.crudAction === 'Crear'
        ? this.crearTipoDeTrabajoEnLaDb(formData)
        : this.editarTipoDeTrabajoEnLaDb(formData);
    }
  }

  public recargarTrabajos(recargar: boolean): void {
    if (recargar) {
      this.resetsetControls();
      this.tableData = [];
      this.tiposDeTrabajo = [];
      this.isCreating = false;
      this.isEditing = false;
      this.getTiposDeTrabajo();
    }
  }

  private resetsetControls(): void {
    this.tipoDeTrabajoForm.controls?.title?.setValue('');
    this.tipoDeTrabajoForm.controls?.image?.setValue('');
    this.imageToShow = '../../../../../assets/no-image.png';
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

  public crearTipoDeTrabajo() {
    this.isEditing = false;
    this.isCreating = true;
    this.crudAction = 'Crear';
  }

  public crearTipoDeTrabajoEnLaDb(formData: FormData): void {
    this.adminPanelCrudService
      .create(formData, 'types')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          this.recargarTrabajos(true);
          this.alertFailureOrSuccess(res?.meta?.status);
        },
        () =>
          Swal.fire(
            'Error',
            'No pudimos crear el tipo de trabajo, por favor intentá de nuevo recargando la página',
            'error'
          )
      );
  }
  public editarTipoDeTrabajo(id: number): void {
    this.isEditing = true;
    this.isCreating = false;
    this.crudAction = 'Editar';
    const tipoDeTrabajo = this.tiposDeTrabajo.find((s) => s.id === id);
    if (tipoDeTrabajo) {
      this.tipoDeTrabajoID = id;
      this.tipoDeTrabajoForm.controls.title.setValue(tipoDeTrabajo.title);
      this.imageToShow = `${environment.API_IMAGE_URL}/${tipoDeTrabajo.image}`;
    }
  }

  public editarTipoDeTrabajoEnLaDb(formData: FormData): void {
    this.adminPanelCrudService
      .edit(this.tipoDeTrabajoID, formData, 'types')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.recargarTrabajos(true);
          this.alertFailureOrSuccess(res?.meta?.status);
        },
        () => {
          this.recargarTrabajos(true);
          Swal.fire(
            'Error',
            'Tuvimos un error desconocido, por favor intenta recargar la página o espera un rato.',
            'error'
          );
        }
      );
  }

  public borrarTipoDeTrabajo(id: number): void {
    Swal.fire({
      title: '¿Seguro querés elimninar el trabajo seleccionado?',
      showDenyButton: true,
      confirmButtonText: 'Si, borrar',
      denyButtonText: `No`,
    }).then((result: SweetAlertResult<any>) => {
      result.isConfirmed ? this.borrarTipoDeTrabajoEnLaDb(id) : null;
    });
  }

  private borrarTipoDeTrabajoEnLaDb(id: number) {
    this.adminPanelCrudService
      .delete(id, 'types')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.recargarTrabajos(true);
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
      Swal.fire('¡Excelente!', 'El tipo de trabajo se creó correctamente', 'success');
    } else {
      Swal.fire(
        'Error',
        'No pudimos crear el tipo de trabajo, por favor intentá de nuevo recargando la página',
        'error'
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
