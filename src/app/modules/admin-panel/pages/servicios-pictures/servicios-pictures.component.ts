import {
  Component,
  Host,
  HostBinding,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
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
  customMessageAlert,
} from '../../../../helpers/alerts';
import {
  Services,
  ServicesData,
  TipoServicioDataPictures,
} from 'src/app/modules/main/interfaces/http/services.interface';
import { ActivatedRoute } from '@angular/router';
import { TipoServicio } from '../../../main/interfaces/http/services.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-servicios-pictures',
  templateUrl: './servicios-pictures.component.html',
  styleUrls: ['./servicios-pictures.component.scss'],
})
export class ServiciosPicturesComponent implements OnInit {
  @HostBinding('class.admin-panel-container') someClass: Host = true;
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;

  public encabezadosTabla: string[] = [];
  public tableData: CuerpoTabla[] = [];
  public servicePicturesForm!: FormGroup;
  public isCreating: boolean = false;
  public isEditing: boolean = false;
  public crudAction: string = '';
  public categoriaDeServicio: ServicesData[] = [];
  public pictureId!: number;
  public creationImageError: string = '';
  public imageToShow: string[] = ['../../../../../assets/no-image.png'];
  public fileToUpload: File[] = [];
  public acceptedFileTypes: boolean = true;

  private pictureCounter: number = 0;
  private pictures: TipoServicioDataPictures[] = [];
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
    this.servicePicturesForm = this.fb.group({
      serviceId: [null, Validators.required],
      image: [''],
    });
  }

  public async showSelectedImage(e: any): Promise<void> {
    if (
      this.crudAction === 'Crear' &&
      !this.servicePicturesForm.controls.image.value
    ) {
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

  public openInput(): void {
    this.imageInput.nativeElement.click();
  }

  ngOnInit(): void {
    this.getServicios();
  }

  public formSubmit(): void {
    if (
      this.crudAction === 'Crear' &&
      !this.servicePicturesForm.controls.image.value
    ) {
      this.creationImageError = 'La imágen es obligatoria';
      return;
    } else {
      this.creationImageError = '';
    }

    this.servicePicturesForm.markAllAsTouched();
    if (this.servicePicturesForm.valid) {
      const formData: FormData = new FormData();
      formData.append(
        'serviceId',
        this.servicePicturesForm.controls.serviceId.value
      );
      if (this.fileToUpload?.length) {
        this.fileToUpload?.forEach((file: File) => {
          formData.append(`pictures`, file);
        });
      }

      this.crudAction === 'Crear'
        ? this.crearPicturesEnLaDb(formData)
        : this.editarPicturesEnLaDb(formData);
    }
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
        this.pictureCounter++;

        this.categoriaDeServicio = this.categoriaDeServicio.filter(
          (categoria) => categoria.id === +params.servicioId
        );

        this.servicePicturesForm.controls.serviceId?.setValue(
          this.categoriaDeServicio[0].id
        );

        if (!this.pictures.length) {
          this.pictures = serv?.data?.Pictures.filter(
            (picture) => picture.services_b_id === +params.servicioId
          );
        }

        if (this.pictureCounter === totalDeServicios) {
          this.pictures?.forEach((picture) => {
            this.tableData.push({
              imagen: `${environment.API_IMAGE_URL}/${picture.picture}`,
              id: picture.id,
            });
          });
        }
      },
      error: (err) => noConnectionAlert(err),
    });
  }

  public recargarServicePictures(recargar: boolean): void {
    if (recargar) {
      this.resetsetControls();
      this.tableData = [];
      this.pictureCounter = 0;
      this.categoriaDeServicio = [];
      this.pictures = [];
      this.isCreating = false;
      this.isEditing = false;
      this.getServicios();
    }
  }

  private resetsetControls(): void {
    this.servicePicturesForm.controls.image.setValue('');
    this.imageToShow = ['../../../../../assets/no-image.png'];
    this.fileToUpload = [];
  }

  public crearPictures(): void {
    this.crudAction = 'Crear';
    this.isCreating = true;
    this.isEditing = false;
  }

  private crearPicturesEnLaDb(formData: FormData) {
    this.adminPanelCrudService
      .createContentOrPictureInService(formData, 'pictures')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.recargarServicePictures(true);
          alertFailureOrSuccessOnCRUDAction(res, 'creó', 'imagen de servicio');
        },
        (err) => {
          this.recargarServicePictures(true);
          noConnectionAlert(err);
        }
      );
  }

  public editarPictures(id: number): void {
    this.crudAction = 'Editar';
    this.isEditing = true;
    this.isCreating = false;
    const picture = this.pictures?.find(
      (pic: TipoServicioDataPictures) => pic.id === id
    );
    if (picture) {
      this.pictureId = picture.id;
      this.imageToShow = [`${environment.API_IMAGE_URL}/${picture.picture}`];
    }
  }

  private editarPicturesEnLaDb(formData: FormData) {
    this.adminPanelCrudService
      .editContentOrPictureInService(this.pictureId, formData, 'pictures')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.recargarServicePictures(true);
          alertFailureOrSuccessOnCRUDAction(res, 'editó', 'imagen de servicio');
        },
        (err) => {
          this.recargarServicePictures(true);
          noConnectionAlert(err);
        }
      );
  }

  public borrarPictures(id: number): void {
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
      .deleteContentOrImageFromService(id, 'pictures')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.recargarServicePictures(true);
          alertFailureOrSuccessOnCRUDAction(res, 'borró', 'imagen de servicio');
        },
        (err) => noConnectionAlert(err)
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
