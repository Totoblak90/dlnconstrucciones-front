import {
  Component,
  ElementRef,
  Host,
  HostBinding,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
  customMessageAlert,
} from '../../../../helpers/alerts';

@Component({
  selector: 'app-trabajos-realizados',
  templateUrl: './trabajos-realizados.component.html',
  styleUrls: ['./trabajos-realizados.component.scss'],
})
export class TrabajosRealizadosComponent implements OnInit, OnDestroy {
  @HostBinding('class.admin-panel-container') someClass: Host = true;
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;

  public encabezadosTabla: string[] = [
    'Título',
    'Descripción',
    'Tipo de trabajo',
  ];
  public tableData: CuerpoTabla[] = [];
  public jobForm!: FormGroup;
  public isCreating: boolean = false;
  public isEditing: boolean = false;
  public crudAction: string = '';
  public imageToShow: string[] = ['../../../../../assets/no-image.png'];
  public fileToUpload: File[] = [];
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

  public openInput(): void {
    this.imageInput.nativeElement.click();
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
      formData.append('type', this.jobForm.controls.type?.value);
      if (this.fileToUpload?.length) {
        this.fileToUpload.forEach((file) => {
          this.fileToUpload && formData.append('image', file);
        });
      }
      this.crudAction === 'Crear'
        ? this.crearTrabajoEnLaDb(formData)
        : this.editarTrabajoEnLaDb(formData);
    }
  }

  public async showSelectedImage(e: any): Promise<void> {
    if (this.crudAction === 'Crear' && !this.jobForm.controls.image.value) {
      this.creationImageError = 'La imágen es obligatoria';
      return;
    } else {
      this.creationImageError = '';
    }

    let files = Array.from(e.target?.files as FileList);

    files = await this.checkAmountOfFiles(files);

    this.acceptedFileTypes = await this.checkFilesType(files);

    if (files.length && this.acceptedFileTypes) {
      this.imageToShow = [];
      this.fileToUpload = files;
      this.fileToUpload.forEach((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => this.imageToShow.push(reader.result as string);
      });
    } else {
      this.fileToUpload = [];
      this.imageToShow = ['../../../../../assets/no-image.png'];
    }
  }

  private checkAmountOfFiles(files: File[]): Promise<File[]> {
    return new Promise((resolve) => {
      if (files.length > 10) {
        customMessageAlert(
          'Atención',
          'No se pueden subir más de 10 imágenes',
          'OK',
          'info'
        );
        files = files.slice(0, 10);
      }
      resolve(files);
    });
  }

  private checkFilesType(files: File[]): Promise<boolean> {
    return new Promise((resolve) => {
      let validator: boolean | 'valido' = 'valido';
      files.forEach((file) => {
        if (
          file.type.includes('image/jpg') ||
          file.type.includes('image/jpeg') ||
          file.type.includes('image/png')
        ) {
        } else {
          validator = false;
        }
      });
      validator === 'valido' ? resolve(true) : resolve(false);
    });
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
            .pipe(takeUntil(this.destroy$))
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
        item4: job.data.title,
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
      this.fileToUpload = [];
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
    this.imageToShow = ['../../../../../assets/no-image.png'];
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
      this.imageToShow = [`${environment.API_IMAGE_URL}/${trabajo.image}`];
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
