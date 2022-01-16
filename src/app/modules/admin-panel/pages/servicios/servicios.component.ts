import { Component, Host, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpService } from '../../../../services/http.service';
import { CuerpoTabla } from '../../interfaces/tabla.interface';
import { takeUntil, finalize } from 'rxjs/operators';
import {
  Services,
  ServicesData,
} from 'src/app/modules/main/interfaces/http/services.interface';
import { environment } from 'src/environments/environment';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminPanelCrudService } from '../../services/admin-panel-crud.service';
import { Router } from '@angular/router';
import {
  noConnectionAlert,
  unknownErrorAlert,
  alertFailureOrSuccessOnCRUDAction,
} from '../../../../helpers/alerts';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss'],
})
export class ServiciosComponent implements OnInit, OnDestroy {
  @HostBinding('class.admin-panel-container') someClass: Host = true;

  public encabezadosTabla: string[] = ['Título'];
  public tableData: CuerpoTabla[] = [];
  private servicios: ServicesData[] = [];
  public servicesForm!: FormGroup;
  public isEditing: boolean = false;
  public isCreating: boolean = false;
  public crudAction: string = '';
  public imageToShow: string = '../../../../../assets/no-image.png';
  public acceptedFileTypes: boolean = true;
  public servicioID!: number;
  public creationImageError: string = '';

  private fileToUpload!: File;
  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private httpSrv: HttpService,
    private fb: FormBuilder,
    private adminPanelCrudService: AdminPanelCrudService,
    private router: Router
  ) {
    this.createForm();
  }

  private createForm(): void {
    this.servicesForm = this.fb.group({
      image: [''],
      title: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.getServicios();
  }

  public getServicios(): void {
    this.httpSrv
      .getAllServices()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (servicios: Services) => {
          servicios.meta?.status.toString().includes('20')
            ? this.setTableData(servicios)
            : unknownErrorAlert(servicios);
        },
        (err) => noConnectionAlert(err)
      );
  }

  private setTableData(servicios: Services): void {
    servicios?.data?.forEach((servicio) => {
      this.tableData.push({
        imagen: `${environment.API_IMAGE_URL}/${servicio.image}`,
        item2: servicio.title,
        id: servicio.id,
      });
      this.servicios.push(servicio);
    });
  }

  public formSubmit(): void {
    this.servicesForm.markAllAsTouched();
    if (
      this.crudAction === 'Crear' &&
      !this.servicesForm.controls.image.value
    ) {
      this.creationImageError = 'La imágen es obligatoria';
      return;
    }
    if (this.servicesForm.valid) {
      const formData: FormData = new FormData();
      formData.append('title', this.servicesForm.controls.title?.value);
      this.fileToUpload && formData.append('image', this.fileToUpload!);

      this.crudAction === 'Crear'
        ? this.crearServicioEnLaDb(formData)
        : this.editarServicioEnLaDb(formData);
    }
  }

  public recargarServicios(recargar: boolean): void {
    if (recargar) {
      this.resetsetControls();
      this.tableData = [];
      this.servicios = [];
      this.isCreating = false;
      this.isEditing = false;
      this.getServicios();
    }
  }

  private resetsetControls(): void {
    this.servicesForm.controls?.title?.setValue('');
    this.servicesForm.controls?.image?.setValue('');
    this.imageToShow = '../../../../../assets/no-image.png';
  }

  public showSelectedImage(e: any) {
    if (
      this.crudAction === 'Crear' &&
      !this.servicesForm.controls.image.value
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

  public crearServicio(): void {
    this.isEditing = false;
    this.isCreating = true;
    this.crudAction = 'Crear';
  }
  public crearServicioEnLaDb(formData: FormData): void {
    this.adminPanelCrudService
      .create(formData, 'services')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.recargarServicios(true);
          alertFailureOrSuccessOnCRUDAction(res, 'creó', 'servicio');
        },
        (err) => {
          this.recargarServicios(true);
          unknownErrorAlert(err);
        }
      );
  }

  public editarServicio(id: number): void {
    this.isEditing = true;
    this.isCreating = false;
    this.crudAction = 'Editar';
    const servicio = this.servicios.find((s) => s.id === id);
    if (servicio) {
      this.servicioID = id;
      this.servicesForm.controls.title.setValue(servicio.title);
      this.imageToShow = `${environment.API_IMAGE_URL}/${servicio.image}`;
    }
  }

  public editarServicioEnLaDb(formData: FormData): void {
    this.adminPanelCrudService
      .edit(this.servicioID, formData, 'services')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.recargarServicios(true);
          alertFailureOrSuccessOnCRUDAction(res, 'creó', 'servicio');
        },
        (err) => {
          this.recargarServicios(true);
          unknownErrorAlert(err);
        }
      );
  }

  public borrarServicio(id: number): void {
    Swal.fire({
      title: '¿Seguro querés elimninar el servicio seleccionado?',
      showDenyButton: true,
      confirmButtonText: 'Si, borrar',
      denyButtonText: `No`,
    }).then((result: SweetAlertResult<any>) => {
      result.isConfirmed ? this.borrarServicioEnLaDb(id) : null;
    });
  }

  public borrarServicioEnLaDb(id: number): void {
    this.adminPanelCrudService
      .delete(id, 'services')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.recargarServicios(true);
          alertFailureOrSuccessOnCRUDAction(res, 'borró', 'servicio');
        },
        (err) => {
          unknownErrorAlert(err);
        }
      );
  }

  public addAssets(id: number): void {
    this.router.navigateByUrl('/admin/servicios/pictures')
  }

  public addContents(id: number): void {
    this.router.navigateByUrl('/admin/servicios/contenidos')
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
