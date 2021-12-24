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

  /** @todo solucionar el problema del validador de la imágen
  private setImageErrors(fg: FormGroup): void {
    const image = fg.get('image')
    console.log(this.crudAction)
    if (image && this.crudAction) {
      return image.setValidators(() => {
        return { required: true };
      });
    }
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1);
      const pass2Control = formGroup.get(pass2);

      if (pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({ notMatch: true });
      }
    };
  }
  */

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
      .subscribe((interests: Interests) => {
        interests.data.forEach((int: InterestsData) => {
          this.tableData.push({
            imagen: `${environment.API_IMAGE_URL}/${int.image}`,
            item2: int.title,
            item3: int.description,
            id: int.id,
          });
          this.interestData.push(int);
        });
      });
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
        () => {
          this.recargarIntereses(true);
          Swal.fire(
            '¡Excelente!',
            'El interés se creó correctamente',
            'success'
          );
        },
        () =>
          Swal.fire(
            'Error',
            'No pudimos crear el interés, por favor intentá de nuevo recargando la página',
            'error'
          )
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
        () => {
          this.recargarIntereses(true);
          Swal.fire(
            '¡Excelente!',
            'Editamos el lote sin problemmas.',
            'success'
          );
        },
        () => {
          this.recargarIntereses(true);
          Swal.fire(
            'Error',
            'Tuvimos un error desconocido, por favor intenta recargar la página o espera un rato.',
            'error'
          );
        }
      );
  }

  public borrarInteres(id: number): void {
    Swal.fire({
      title: '¿Seguro querés elimninar el trabajo seleccionado?',
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
        () => {
          this.recargarIntereses(true);
          Swal.fire(
            '¡Genial!',
            'Hemos completado tu pedido, gracias',
            'success'
          );
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
