import { Component, Host, HostBinding, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CuerpoTabla } from '../../interfaces/tabla.interface';
import { HttpService } from '../../../../services/http.service';
import { finalize, takeUntil } from 'rxjs/operators';
import {
  PostalZones,
  PostalZonesData,
} from 'src/app/modules/main/interfaces/http/batches.interface';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminPanelCrudService } from '../../services/admin-panel-crud.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-zonas',
  templateUrl: './zonas.component.html',
  styleUrls: ['./zonas.component.scss'],
})
export class ZonasComponent implements OnInit {
  @HostBinding('class.admin-panel-container') someClass: Host = true;

  public encabezadosTabla: string[] = ['Título'];
  public tableData: CuerpoTabla[] = [];
  public loading: boolean = true;
  public zonas: PostalZonesData[] = [];
  public zonasForm!: FormGroup;
  public isEditing: boolean = false;
  public isCreating: boolean = false;
  public crudAction: string = '';
  public imageToShow: string = '../../../../../assets/no-image.png';
  public acceptedFileTypes: boolean = true;
  public zonaID!: number;
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
    this.zonasForm = this.fb.group({
      image: [''],
      title: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.getZonas();
  }

  private getZonas(): void {
    this.httpSrv
      .getAllZones()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (zonas: PostalZones) => {
          zonas?.data?.forEach((zona) => {
            this.tableData.push({
              imagen: `${environment.API_IMAGE_URL}/${zona.image}`,
              item2: zona.title,
              id: zona.id,
            });
            this.zonas.push(zona);
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
    this.zonasForm.markAllAsTouched();
    if (this.zonasForm.valid) {
      const formData: FormData = new FormData();
      formData.append('title', this.zonasForm.controls.title?.value);
      formData.append('image', this.fileToUpload!);

      this.crudAction === 'Crear'
        ? this.crearZonaEnLaDb(formData)
        : this.editarZonaEnLaDb(formData);
    }
  }

  public recargarZonas(recargar: boolean): void {
    if (recargar) {
      this.resetsetControls();
      this.tableData = [];
      this.tableData = [];
      this.zonas = [];
      this.isCreating = false;
      this.isEditing = false;
      this.getZonas();
    }
  }

  private resetsetControls(): void {
    this.zonasForm.controls?.title?.setValue('');
    this.zonasForm.controls?.image?.setValue('');
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

  public openCrearZona(): void {
    this.isEditing = false;
    this.isCreating = true;
    this.crudAction = 'Crear';
  }

  private crearZonaEnLaDb(formData: FormData): void {
    this.adminPanelCrudService
      .create(formData, 'categories')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          this.recargarZonas(true);
          this.alertFailureOrSuccess(res?.meta?.status);
        },
        () => {
          this.recargarZonas(true);
          Swal.fire(
            'Error',
            'No pudimos crear la zona, por favor intentá de nuevo recargando la página',
            'error'
          );
        }
      );
  }

  public openEditarZona(id: number): void {
    this.isEditing = true;
    this.isCreating = false;
    this.crudAction = 'Editar';
    const zonaSeleccionada = this.zonas.find((s) => s.id === id);
    if (zonaSeleccionada) {
      this.zonaID = id;
      this.zonasForm.controls.title.setValue(zonaSeleccionada.title);
      this.imageToShow = `${environment.API_IMAGE_URL}/${zonaSeleccionada.image}`;
    }
  }

  public editarZonaEnLaDb(formData: FormData): void {
    this.adminPanelCrudService
      .edit(this.zonaID, formData, 'categories')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.recargarZonas(true);
          this.alertFailureOrSuccess(res?.meta?.status);
        },
        () => {
          this.recargarZonas(true);
          Swal.fire(
            'Error',
            'Tuvimos un error desconocido, por favor intenta recargar la página o espera un rato.',
            'error'
          );
        }
      );
  }

  public openBorrarZona(id: number): void {
    Swal.fire({
      title: '¿Seguro querés elimninar el trabajo seleccionado?',
      showDenyButton: true,
      confirmButtonText: 'Si, borrar',
      denyButtonText: `No`,
    }).then((result: SweetAlertResult<any>) => {
      result.isConfirmed ? this.borrarZonaEnLaDb(id) : null;
    });
  }

  private borrarZonaEnLaDb(id: number) {
    this.adminPanelCrudService
      .delete(id, 'categories')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.recargarZonas(true);
          this.alertFailureOrSuccess(res?.meta?.status);
        },
        () => {
          this.recargarZonas(true)
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
      Swal.fire(
        '¡Excelente!',
        'La zona se creó correctamente',
        'success'
      );
    } else {
      Swal.fire(
        'Error',
        'No pudimos crear la zona, por favor intentá de nuevo recargando la página',
        'error'
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
