import { Component, Host, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { concat, Subject } from 'rxjs';
import { HttpService } from '../../../../services/http.service';
import { CuerpoTabla } from '../../interfaces/tabla.interface';
import { takeUntil, finalize } from 'rxjs/operators';
import {
  Services,
  ServicesData,
  TipoServicio,
} from 'src/app/modules/main/interfaces/http/services.interface';
import { environment } from 'src/environments/environment';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminPanelCrudService } from '../../services/admin-panel-crud.service';

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
  public loading: boolean = true;
  public servicesForm!: FormGroup;
  public isEditing: boolean = false;
  public isCreating: boolean = false;
  public crudAction: string = '';
  public imageToShow: string = '../../../../../assets/no-image.png';
  public acceptedFileTypes: boolean = true;
  public servicioID!: number;

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
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (servicios: Services) => {
          servicios?.data?.forEach((servicio) => {
            this.tableData.push({
              imagen: `${environment.API_IMAGE_URL}/${servicio.image}`,
              item2: servicio.title,
              id: servicio.id,
            });
            this.servicios.push(servicio);
          });
        },
        () => {
          Swal.fire(
            '¡Lo sentimos!',
            'No pudimos cargar los servicios como esperabamos, intentá de nuevo y sino ponete en contacto con tu proveedor de internet',
            'warning'
          );
        }
      );
  }

  public formSubmit(): void {
    this.servicesForm.markAllAsTouched();
    if (this.servicesForm.valid) {
      const formData: FormData = new FormData();
      formData.append('title', this.servicesForm.controls.title?.value);
      formData.append('image', this.fileToUpload!);

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
          this.alertFailureOrSuccess(res?.meta?.status);
        },
        () =>
          Swal.fire(
            'Error',
            'No pudimos crear el interés, por favor intentá de nuevo recargando la página',
            'error'
          )
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
          this.alertFailureOrSuccess(res?.meta?.status);
        },
        () => {
          this.recargarServicios(true);
          Swal.fire(
            'Error',
            'Tuvimos un error desconocido, por favor intenta recargar la página o espera un rato.',
            'error'
          );
        }
      );
  }

  public borrarServicio(id: number): void {
    Swal.fire({
      title: '¿Seguro querés elimninar el trabajo seleccionado?',
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
        'Error',
        'No pudimos crear la zona, por favor intentá de nuevo recargando la página',
        'error'
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
