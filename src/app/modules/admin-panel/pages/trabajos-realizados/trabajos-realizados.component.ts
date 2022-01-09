import { Component, Host, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import {
  Job,
  JobMoreInfo,
  TypesOfJobs,
  TypesOfJobsData,
} from 'src/app/modules/main/interfaces/http/jobs.interface';
import { CuerpoTabla } from '../../interfaces/tabla.interface';
import { HttpService } from '../../../../services/http.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { AdminPanelCrudService } from '../../services/admin-panel-crud.service';
import {
  noConnectionAlert,
  unknownErrorAlert,
  alertFailureOrSuccessOnCRUDAction,
} from '../../../../helpers/alerts';

@Component({
  selector: 'app-trabajos-realizados',
  templateUrl: './trabajos-realizados.component.html',
  styleUrls: ['./trabajos-realizados.component.scss'],
})
export class TrabajosRealizadosComponent implements OnInit, OnDestroy {
  @HostBinding('class.admin-panel-container') someClass: Host = true;

  public encabezadosTabla: string[] = ['Título', 'Descripción'];
  public tableData: CuerpoTabla[] = [];
  public loading: boolean = true;
  public jobForm!: FormGroup;
  public isCreating: boolean = false;
  public isEditing: boolean = false;
  public crudAction: string = '';
  public imageToShow: string = '../../../../../assets/no-image.png';
  public fileToUpload?: File;
  public acceptedFileTypes: boolean = true;
  public categoriaDeTrabajo: TypesOfJobsData[] = [];
  public trabajoID!: number;
  public creationImageError: string = '';

  private jobs: JobMoreInfo[] = [];
  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private httpSrv: HttpService,
    private adminPanelCrudService: AdminPanelCrudService,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  private createForm() {
    this.jobForm = this.fb.group({
      type: [null, Validators.required],
      title: ['', Validators.minLength(6)],
      description: ['', Validators.minLength(10)],
      image: [''],
    });
  }

  ngOnInit(): void {
    this.getTrabajos();
  }

  public formSubmit(): void {
    this.jobForm.markAllAsTouched();

    if (this.crudAction === 'Crear' && !this.jobForm.controls.image.value) {
      this.creationImageError = 'La imágen es obligatoria';
      return;
    }

    if (this.jobForm.valid) {
      const formData: FormData = new FormData();
      formData.append('title', this.jobForm.controls.title?.value);
      formData.append('description', this.jobForm.controls.description?.value);
      formData.append('image', this.fileToUpload!);
      formData.append('type', this.jobForm.controls.type?.value);

      this.crudAction === 'Crear'
        ? this.crearTrabajoEnLaDb(formData)
        : this.editarTrabajoEnLaDb(formData);
    }
  }

  public showSelectedImage(e: any) {
    if (this.crudAction === 'Crear' && !this.jobForm.controls.image.value) {
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

  private getTrabajos(): void {
    this.httpSrv
      .getTypesOfJob()
      .pipe(takeUntil(this.destroy$))
      .subscribe((typesOfJobs: TypesOfJobs) => {
        for (const typeOfJob of typesOfJobs.data) {
          this.categoriaDeTrabajo.push(typeOfJob);
          this.httpSrv
            .getOneTypeOfJob(typeOfJob.id.toString())
            .pipe(
              takeUntil(this.destroy$),
              finalize(() => (this.loading = false))
            )
            .subscribe(
              (job: Job) => {
                job.meta.status.toString().includes('20')
                  ? this.setTableData(job)
                  : unknownErrorAlert(job);
              },
              (err) => noConnectionAlert(err)
            );
        }
      });
  }

  private setTableData(job: Job): void {
    job?.data?.Jobs.forEach((j) => {
      this.tableData.push({
        imagen: `${environment.API_IMAGE_URL}/${j.image}`,
        item2: j.title ? j.title : 'Vacío',
        item3: j.description ? j.description : 'Vacío',
        id: j.id,
      });
      this.jobs.push(j);
    });
  }

  public recargarTrabajos(recargar: boolean): void {
    if (recargar) {
      this.resetsetControls();
      this.tableData = [];
      this.categoriaDeTrabajo = [];
      this.jobs = [];
      this.isCreating = false;
      this.isEditing = false;
      this.getTrabajos();
    }
  }

  private resetsetControls(): void {
    this.jobForm.controls.title.setValue('');
    this.jobForm.controls.description.setValue('');
    this.jobForm.controls.type.setValue('');
    this.jobForm.controls.image.setValue('');
    this.imageToShow = '../../../../../assets/no-image.png';
  }

  public crearTrabajoRealizado(): void {
    this.crudAction = 'Crear';
    this.isCreating = true;
    this.isEditing = false;
  }

  private crearTrabajoEnLaDb(formData: FormData) {
    this.adminPanelCrudService
      .create(formData, 'jobs')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.recargarTrabajos(true);
          alertFailureOrSuccessOnCRUDAction(res, 'creó', 'trabajo realizado');
        },
        (err) => {
          this.recargarTrabajos(true);
          noConnectionAlert(err);
        }
      );
  }

  public editarTrabajoRealizado(id: number): void {
    this.crudAction = 'Editar';
    this.isEditing = true;
    this.isCreating = false;
    const trabajo = this.jobs?.find((job) => job.id === id);
    if (trabajo) {
      this.trabajoID = trabajo.id;
      this.jobForm.controls.title.setValue(trabajo.title);
      this.jobForm.controls.description.setValue(trabajo.description);
      this.jobForm.controls.type.setValue(trabajo.types_id);
      this.imageToShow = `${environment.API_IMAGE_URL}/${trabajo.image}`;
    }
  }

  private editarTrabajoEnLaDb(formData: FormData) {
    this.adminPanelCrudService
      .edit(this.trabajoID, formData, 'jobs')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.recargarTrabajos(true);
          alertFailureOrSuccessOnCRUDAction(res, 'editó', 'trabajo realizado');
        },
        (err) => {
          this.recargarTrabajos(true);
          noConnectionAlert(err);
        }
      );
  }

  public borrarTrabajoRealizado(id: number): void {
    Swal.fire({
      title: '¿Seguro querés elimninar el trabajo realizado seleccionado?',
      showDenyButton: true,
      confirmButtonText: 'Si, borrar',
      denyButtonText: `No`,
    }).then((result: SweetAlertResult<any>) => {
      result.isConfirmed ? this.borrarTrabajoDeLaDb(id) : null;
    });
  }

  private borrarTrabajoDeLaDb(id: number): void {
    this.adminPanelCrudService
      .delete(id, 'jobs')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.recargarTrabajos(true);
          alertFailureOrSuccessOnCRUDAction(res, 'borró', 'trabajo realizado');
        },
        (err) => noConnectionAlert(err)
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
