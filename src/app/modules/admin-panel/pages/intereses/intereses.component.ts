import { Component, Host, HostBinding, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CuerpoTabla } from '../../interfaces/tabla.interface';
import { HttpService } from '../../../../services/http.service';
import { finalize, takeUntil } from 'rxjs/operators';
import {
  Interests,
  InterestsData,
} from 'src/app/modules/main/interfaces/http/interests.interface';
import { environment } from 'src/environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminPanelCrudService } from '../../services/admin-panel-crud.service';
import Swal, { SweetAlertResult } from 'sweetalert2';
import {
  noConnectionAlert,
  unknownErrorAlert,
  alertFailureOrSuccessOnCRUDAction,
} from '../../../../helpers/alerts';

@Component({
  selector: 'app-intereses',
  templateUrl: './intereses.component.html',
  styleUrls: ['./intereses.component.scss'],
})
export class InteresesComponent implements OnInit {
  @HostBinding('class.admin-panel-container') someClass: Host = true;

  public encabezadosTabla: string[] = ['Título', 'Descripción'];
  public tableData: CuerpoTabla[] = [];
  public interestData: InterestsData[] = [];
  public loading: boolean = true;
  public isCreating: boolean = false;
  public isEditing: boolean = false;
  public crudAction: string = '';
  public interestForm!: FormGroup;
  public imageToShow: string = '../../../../../assets/no-image.png';
  public fileToUpload?: File;
  public acceptedFileTypes: boolean = true;
  public interestsID!: number;
  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private httpService: HttpService,
    private fb: FormBuilder,
    private adminPanelCrudService: AdminPanelCrudService
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
    this.getIntereses();
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

  private getIntereses(): void {
    this.httpService
      .getInterests()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (interests: Interests) => {
          if (interests.meta?.status.toString().includes('20')) {
            interests.data.forEach((int: InterestsData) =>
              this.setTableData(int)
            );
          } else {
            unknownErrorAlert(interests);
          }
        },
        (err) => noConnectionAlert(err)
      );
  }

  private setTableData(interes: InterestsData): void {
    this.tableData.push({
      imagen: `${environment.API_IMAGE_URL}/${interes.image}`,
      item2: interes.title,
      item3: interes.description,
      id: interes.id,
    });
    this.interestData.push(interes);
  }

  public recargarIntereses(recargar: boolean): void {
    if (recargar) {
      this.resetsetControls();
      this.tableData = [];
      this.interestData = [];
      this.isCreating = false;
      this.isEditing = false;
      this.getIntereses();
    }
  }

  private resetsetControls(): void {
    this.interestForm.controls.title.setValue('');
    this.interestForm.controls.description.setValue('');
    this.interestForm.controls.image.setValue('');
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
          this.recargarIntereses(true);
          alertFailureOrSuccessOnCRUDAction(res, 'creó', 'interés');
        },
        (err) => {
          this.recargarIntereses(true);
          noConnectionAlert(err);
        }
      );
  }

  public editarInteres(id: number): void {
    this.crudAction = 'Editar';
    this.isEditing = true;
    this.isCreating = false;
    const interes = this.interestData.find((int) => int.id === id);
    if (interes) {
      this.interestsID = id;
      this.interestForm.controls.title.setValue(interes.title);
      this.interestForm.controls.description.setValue(interes.description);
      this.imageToShow = `${environment.API_IMAGE_URL}/${interes.image}`;
    }
  }

  public editarInteresEnLaDb(formData: FormData): void {
    this.adminPanelCrudService
      .edit(this.interestsID, formData, 'interests')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.recargarIntereses(true);
          alertFailureOrSuccessOnCRUDAction(res, 'editó', 'interés');
        },
        (err) => {
          this.recargarIntereses(true);
          noConnectionAlert(err);
        }
      );
  }

  public borrarInteres(id: number): void {
    Swal.fire({
      title: '¿Seguro querés elimninar el interés seleccionado?',
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
          this.recargarIntereses(true);
          alertFailureOrSuccessOnCRUDAction(res, 'borró', 'interés');
        },
        (err) => {
          this.recargarIntereses(true);
          noConnectionAlert(err);
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
