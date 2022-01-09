import { Component, Host, HostBinding, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CuerpoTabla } from '../../interfaces/tabla.interface';
import { HttpService } from '../../../../services/http.service';
import { takeUntil, finalize } from 'rxjs/operators';
import {
  Batch,
  Lotes,
  PostalZones,
} from '../../../main/interfaces/http/batches.interface';
import { environment } from 'src/environments/environment';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ZonasDeConstruccion } from '../../interfaces/lotes.interface';
import { AdminPanelCrudService } from '../../services/admin-panel-crud.service';
import {
  noConnectionAlert,
  unknownErrorAlert,
  alertFailureOrSuccessOnCRUDAction,
} from '../../../../helpers/alerts';

@Component({
  selector: 'app-lotes',
  templateUrl: './lotes.component.html',
  styleUrls: ['./lotes.component.scss'],
})
export class LotesComponent implements OnInit {
  @HostBinding('class.admin-panel-container') someClass: Host = true;

  public encabezadosTabla: string[] = [
    'Título',
    'Descripción',
    'Precio',
    'Vendido',
  ];
  public tableData: CuerpoTabla[] = [];
  public loading: boolean = true;
  public lotes: Batch[] = [];
  public isCreating: boolean = false;
  public isEditing: boolean = false;
  public crudAction: string = '';
  public zonasDeConstruccion: ZonasDeConstruccion[] = [];

  // Formulario para crear o editar lotes
  public loteForm!: FormGroup;

  public imageToShow: string = '../../../../../assets/no-image.png';
  public fileToUpload?: File;
  public acceptedFileTypes: boolean = true;
  public creationImageError: string = '';

  private loteID!: number;
  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private httpSrv: HttpService,
    private adminPanelCrudService: AdminPanelCrudService,
    private fb: FormBuilder
  ) {
    this.crearForm();
  }

  ngOnInit(): void {
    this.getLotes();
  }

  private crearForm(): void {
    this.loteForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(6)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      image: [''],
      price: ['', [Validators.required, Validators.min(1)]],
      sold: ['false'],
      category: [null, [Validators.required]],
    });
  }

  public showSelectedImage(e: any) {
    if (this.crudAction === 'Crear' && !this.loteForm.controls.image.value) {
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

  public formSubmit(): void {
    this.loteForm.markAllAsTouched();
    if (
      this.crudAction === 'Crear' &&
      !this.loteForm.controls.image.value
    ) {
      this.creationImageError = 'La imágen es obligatoria';
      return;
    }

    if (this.loteForm.valid) {
      const formData: FormData = new FormData();
      formData.append('title', this.loteForm.controls.title?.value);
      formData.append('description', this.loteForm.controls.description?.value);
      formData.append('price', this.loteForm.controls.price?.value);
      formData.append('sold', this.loteForm.controls.sold?.value);
      formData.append('image', this.fileToUpload!);
      formData.append('category', this.loteForm.controls.category?.value);

      this.crudAction === 'Crear'
        ? this.crearLoteEnLaDb(formData)
        : this.editarLoteEnLaDb(formData);
    }
  }

  private getLotes(): void {
    this.httpSrv
      .getAllZones()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (zonas: PostalZones) => {
          for (const zona of zonas.data) {
            this.zonasDeConstruccion.push({
              id: zona.id,
              nombre: zona.title,
            });
            this.httpSrv
              .getLotes(zona.id.toString())
              .pipe(
                takeUntil(this.destroy$),
                finalize(() => (this.loading = false))
              )
              .subscribe(
                (lotes: Lotes) => {
                  if (lotes?.meta?.status.toString().includes('20')) {
                    lotes?.data?.Batches.forEach((lote: Batch) =>
                      this.setTableData(lote)
                    );
                  } else {
                    unknownErrorAlert(lotes);
                  }
                },
                (err) => noConnectionAlert(err)
              );
          }
        },
        (err) => noConnectionAlert(err)
      );
  }

  private setTableData(lote: Batch): void {
    this.tableData.push({
      imagen: `${environment.API_IMAGE_URL}/${lote.image}`,
      item2: lote.title ? lote.title : 'Vacío',
      item3: lote.description ? lote.description : 'Vacío',
      item4: lote.price?.toString() ? lote.price?.toString() : 'Vacío',
      item6: this.setearElEstadoVendidoONo(lote.sold),
      id: lote.id,
    });
    this.lotes.push(lote);
  }

  private setearElEstadoVendidoONo(palabra: string): string {
    let frase = '';
    palabra === 'true' ? (frase = 'Si') : (frase = 'No');
    return frase;
  }

  public recargarLotes(recargar: boolean): void {
    if (recargar) {
      this.resetsetControls();
      this.tableData = [];
      this.zonasDeConstruccion = [];
      this.lotes = [];
      this.isEditing = false;
      this.isCreating = false;
      this.getLotes();
    }
  }

  private resetsetControls(): void {
    this.loteForm.controls.title.setValue('');
    this.loteForm.controls.description.setValue('');
    this.loteForm.controls.category.setValue('');
    this.loteForm.controls.price.setValue('');
    this.loteForm.controls.sold.setValue('');
    this.loteForm.controls.image.setValue('');
    this.imageToShow = '../../../../../assets/no-image.png';
  }

  public creatLote(): void {
    this.crudAction = 'Crear';
    this.isCreating = true;
    this.isEditing = false;
  }

  private crearLoteEnLaDb(payload: FormData): void {
    this.adminPanelCrudService
      .create(payload, 'batches')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.recargarLotes(true);
          alertFailureOrSuccessOnCRUDAction(res, 'creó', 'lote');
        },
        (err) => {
          this.recargarLotes(true);
          noConnectionAlert(err);
        }
      );
  }

  public editarLote(id: number): void {
    if (this.encontrarLoteSeleccionado(id)) {
      this.crudAction = 'Editar';
      this.isEditing = true;
      this.isCreating = false;
      const lote = this.lotes.find((lote) => lote.id === id);
      if (lote) {
        this.loteID = id;
        this.loteForm.controls.title.setValue(lote.title);
        this.loteForm.controls.description.setValue(lote.description);
        this.loteForm.controls.category.setValue(lote.categories_id);
        this.loteForm.controls.price.setValue(lote.price);
        this.loteForm.controls.sold.setValue(lote.sold);
        this.imageToShow = `${environment.API_IMAGE_URL}/${lote.image}`;
      }
    }
  }

  private editarLoteEnLaDb(payload: FormData): void {
    this.adminPanelCrudService
      .edit(this.loteID, payload, 'batches')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.recargarLotes(true);
          alertFailureOrSuccessOnCRUDAction(res, 'editó', 'lote');
        },
        (err) => {
          this.recargarLotes(true);
          noConnectionAlert(err);
        }
      );
  }

  public borrarLote(id: number): void {
    if (this.encontrarLoteSeleccionado(id)) {
      Swal.fire({
        title: '¿Seguro querés elimninar el lote seleccionado?',
        showDenyButton: true,
        confirmButtonText: 'Si, borrar',
        denyButtonText: `No`,
      }).then((result: SweetAlertResult<any>) => {
        result.isConfirmed ? this.borrarLoteDeLaDb(id) : null;
      });
    }
  }

  private borrarLoteDeLaDb(id: number): void {
    this.adminPanelCrudService
      .delete(id, 'batches')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.recargarLotes(true);
          alertFailureOrSuccessOnCRUDAction(res, 'borró', 'lote');
        },
        (err) => {
          this.recargarLotes(true);
          noConnectionAlert(err);
        }
      );
  }

  private encontrarLoteSeleccionado(id: number): Batch | undefined {
    const loteSeleccionado: Batch | undefined = this.lotes.find((lote) => {
      return lote.id === id;
    });
    return loteSeleccionado;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
