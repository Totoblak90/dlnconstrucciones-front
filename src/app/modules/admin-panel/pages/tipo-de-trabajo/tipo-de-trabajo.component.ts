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
import {
  alertFailureOrSuccessOnCRUDAction,
  unknownErrorAlert,
  noConnectionAlert,
} from '../../../../helpers/alerts';

@Component({
  selector: 'app-tipo-de-trabajo',
  templateUrl: './tipo-de-trabajo.component.html',
  styleUrls: ['./tipo-de-trabajo.component.scss'],
})
export class TipoDeTrabajoComponent implements OnInit {
  @HostBinding('class.admin-panel-container') someClass: Host = true;

  public encabezadosTabla: string[] = ['Título'];
  public tableData: CuerpoTabla[] = [];
  public tiposDeTrabajo: TypesOfJobsData[] = [];
  public tipoDeTrabajoForm!: FormGroup;
  public isEditing: boolean = false;
  public isCreating: boolean = false;
  public crudAction: string = '';
  public imageToShow: string = '../../../../../assets/no-image.png';
  public acceptedFileTypes: boolean = true;
  public tipoDeTrabajoID!: number;
  public creationImageError: string = '';

  private fileToUpload!: File;
  private destroy$: Subject<boolean> = new Subject();

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
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (typesOfJob: TypesOfJobs) => {
          typesOfJob.meta?.status?.toString().includes('20')
            ? this.setTableData(typesOfJob)
            : unknownErrorAlert(typesOfJob);
        },
        (err) => noConnectionAlert(err)
      );
  }

  private setTableData(typesOfJob: TypesOfJobs): void {
    typesOfJob.data.forEach((typeOfJob) => {
      this.tableData.push({
        imagen: `${environment.API_IMAGE_URL}/${typeOfJob.image}`,
        item2: typeOfJob.title,
        id: typeOfJob.id,
      });
      this.tiposDeTrabajo.push(typeOfJob);
    });
  }

  public formSubmit(): void {
    this.tipoDeTrabajoForm.markAllAsTouched();
    if (
      this.crudAction === 'Crear' &&
      !this.tipoDeTrabajoForm.controls.image.value
    ) {
      this.creationImageError = 'La imágen es obligatoria';
      return;
    }

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
    if (
      this.crudAction === 'Crear' &&
      !this.tipoDeTrabajoForm.controls.image.value
    ) {
      this.creationImageError = 'La imágen es obligatoria';
      return;
    } else {
      this.creationImageError = '';
    }

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
          alertFailureOrSuccessOnCRUDAction(res, 'creó', 'tipo de trabajo');
        },
        (err) => {
          this.recargarTrabajos(true);
          noConnectionAlert(err);
        }
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
          alertFailureOrSuccessOnCRUDAction(res, 'editó', 'tipo de trabajo');
        },
        (err) => {
          this.recargarTrabajos(true);
          noConnectionAlert(err);
        }
      );
  }

  public borrarTipoDeTrabajo(id: number): void {
    Swal.fire({
      title: '¿Seguro querés elimninar el tipo de trabajo seleccionado?',
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
          alertFailureOrSuccessOnCRUDAction(res, 'borró', 'tipo de trabajo');
        },
        (err) => noConnectionAlert(err)
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
