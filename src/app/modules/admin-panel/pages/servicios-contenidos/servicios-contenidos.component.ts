import { Component, Host, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CuerpoTabla } from '../../interfaces/tabla.interface';
import { HttpService } from '../../../../services/http.service';
import { takeUntil, finalize, tap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { AdminPanelCrudService } from '../../services/admin-panel-crud.service';
import {
  noConnectionAlert,
  unknownErrorAlert,
  alertFailureOrSuccessOnCRUDAction,
} from '../../../../helpers/alerts';
import {
  Services,
  ServicesData,
} from 'src/app/modules/main/interfaces/http/services.interface';
import { ActivatedRoute } from '@angular/router';
import {
  TipoServicio,
  TipoServicioDataContent,
} from '../../../main/interfaces/http/services.interface';

@Component({
  selector: 'app-servicios-contenidos',
  templateUrl: './servicios-contenidos.component.html',
  styleUrls: ['./servicios-contenidos.component.scss'],
})
export class ServiciosContenidosComponent implements OnInit {
  @HostBinding('class.admin-panel-container') someClass: Host = true;

  public encabezadosTabla: string[] = ['Título', 'Descripción'];
  public tableData: CuerpoTabla[] = [];
  public serviceContentsForm!: FormGroup;
  public isCreating: boolean = false;
  public isEditing: boolean = false;
  public crudAction: string = '';
  public categoriaDeServicio: ServicesData[] = [];
  public contentId!: number;
  public creationImageError: string = '';

  private contentCounter: number = 0;
  private contents: TipoServicioDataContent[] = [];
  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private httpSrv: HttpService,
    private adminPanelCrudService: AdminPanelCrudService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
    this.createForm();
  }

  private createForm() {
    this.serviceContentsForm = this.fb.group(
      {
        serviceId: [null, Validators.required],
        subtitle: ['', Validators.minLength(6)],
        text: ['', Validators.minLength(10)],
      },
      {
        validator: this.checkAtLeastOneTextFieldIsRequired,
      }
    );
  }

  private checkAtLeastOneTextFieldIsRequired(form: FormGroup): void {
    const subtitle = form.get('subtitle');
    const text = form.get('text');

    if (
      !subtitle?.value &&
      !text?.value &&
      (subtitle?.touched || text?.touched)
    ) {
      text?.setErrors({ required: true });
    } else {
      text?.setErrors(null);
    }
  }

  ngOnInit(): void {
    this.getServicios();
  }

  public formSubmit(): void {
    this.serviceContentsForm.markAllAsTouched();
    if (this.serviceContentsForm.valid) {
      const formData = this.createFormData();
      if (formData) {
        this.crudAction === 'Crear'
          ? this.crearContenidoEnLaDb(formData)
          : this.editarContenidoEnLaDb(formData);
      }
    }
  }

  private createFormData(): any {
    let formData = {
      subtitle: undefined,
      text: undefined,
      serviceId: this.serviceContentsForm.controls.serviceId.value,
    };
    this.serviceContentsForm.controls.subtitle.value
      ? (formData.subtitle = this.serviceContentsForm.controls.subtitle.value)
      : null;
    this.serviceContentsForm.controls.text.value
      ? (formData.text = this.serviceContentsForm.controls.text.value)
      : null;
    if (!formData.subtitle) {
      delete formData.subtitle;
    } else if (!formData.text) {
      delete formData.text;
    }
    return formData;
  }

  private getServicios(): void {
    this.httpSrv
      .getAllServices()
      .pipe(takeUntil(this.destroy$))
      .subscribe((servicios: Services) => {
        for (const servicio of servicios.data) {
          this.categoriaDeServicio.push(servicio);
          this.httpSrv
            .getOneService(servicio.id.toString())
            .pipe(takeUntil(this.destroy$))
            .subscribe(
              (serv: TipoServicio) => {
                serv.meta.status.toString().includes('20')
                  ? this.setTableData(serv, servicios.data.length)
                  : unknownErrorAlert(serv);
              },
              (err) => noConnectionAlert(err)
            );
        }
      });
  }

  private setTableData(serv: TipoServicio, totalDeServicios: number): void {
    this.activatedRoute.params.pipe(takeUntil(this.destroy$)).subscribe({
      next: (params) => {
        this.contentCounter++;

        this.categoriaDeServicio = this.categoriaDeServicio.filter(
          (categoria) => categoria.id === +params.servicioId
        );

        this.serviceContentsForm.controls.serviceId?.setValue(
          this.categoriaDeServicio[0].id
        );

        if (!this.contents.length) {
          this.contents = serv?.data?.Contents.filter(
            (content) => content.services_a_id === +params.servicioId
          );
        }

        if (this.contentCounter === totalDeServicios) {
          this.contents?.forEach((content) => {
            this.tableData.push({
              item2: content.subtitle ? content.subtitle : 'Vacío',
              item3: content.text ? content.text : 'Vacío',
              id: content.id,
            });
          });
        }
      },
      error: (err) => noConnectionAlert(err),
    });
  }

  public recargarServiceContents(recargar: boolean): void {
    if (recargar) {
      this.resetsetControls();
      this.tableData = [];
      this.contentCounter = 0;
      this.categoriaDeServicio = [];
      this.contents = [];
      this.isCreating = false;
      this.isEditing = false;
      this.getServicios();
    }
  }

  private resetsetControls(): void {
    this.serviceContentsForm.controls.serviceId.setValue('');
    this.serviceContentsForm.controls.subtitle.setValue('');
    this.serviceContentsForm.controls.text.setValue('');
  }

  public crearContenido(): void {
    this.crudAction = 'Crear';
    this.isCreating = true;
    this.isEditing = false;
  }

  private crearContenidoEnLaDb(formData: FormData) {
    this.adminPanelCrudService
      .createContentOrPictureInService(formData, 'contents')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.recargarServiceContents(true);
          alertFailureOrSuccessOnCRUDAction(res, 'creó', 'contenido');
        },
        (err) => {
          this.recargarServiceContents(true);
          noConnectionAlert(err);
        }
      );
  }

  public editarContenido(id: number): void {
    this.crudAction = 'Editar';
    this.isEditing = true;
    this.isCreating = false;
    const contenido = this.contents?.find(
      (cont: TipoServicioDataContent) => cont.id === id
    );
    if (contenido) {
      this.contentId = contenido.id;
      this.serviceContentsForm.controls.subtitle?.setValue(contenido.subtitle);
      this.serviceContentsForm.controls.text?.setValue(contenido.text);
      this.serviceContentsForm.controls.type?.setValue(contenido.services_a_id);
    }
  }

  private editarContenidoEnLaDb(formData: FormData) {
    this.adminPanelCrudService
      .editContentOrPictureInService(this.contentId, formData, 'contents')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.recargarServiceContents(true);
          alertFailureOrSuccessOnCRUDAction(res, 'editó', 'contenido');
        },
        (err) => {
          this.recargarServiceContents(true);
          noConnectionAlert(err);
        }
      );
  }

  public borrarContenido(id: number): void {
    Swal.fire({
      title: '¿Seguro querés elimninar el trabajo realizado seleccionado?',
      showDenyButton: true,
      confirmButtonText: 'Si, borrar',
      denyButtonText: `No`,
    }).then((result: SweetAlertResult<any>) => {
      result.isConfirmed ? this.borrarContenidoEnLaDb(id) : null;
    });
  }

  private borrarContenidoEnLaDb(id: number): void {
    this.adminPanelCrudService
      .deleteContentOrImageFromService(id, 'contents')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.recargarServiceContents(true);
          alertFailureOrSuccessOnCRUDAction(res, 'borró', 'contenido');
        },
        (err) => noConnectionAlert(err)
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
