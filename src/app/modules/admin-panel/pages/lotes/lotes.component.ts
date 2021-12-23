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
import { LotesService } from '../../services/lotes.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ZonasDeConstruccion } from '../../interfaces/lotes.interface';

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

  private loteID!: number;
  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private httpSrv: HttpService,
    private lotesService: LotesService,
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
                  lotes?.data?.Batches.forEach((lote) => {
                    this.tableData.push({
                      imagen: `${environment.API_IMAGE_URL}/${lote.image}`,
                      item2: lote.title ? lote.title : 'Vacío',
                      item3: lote.description ? lote.description : 'Vacío',
                      item4: lote.price?.toString()
                        ? lote.price?.toString()
                        : 'Vacío',
                      item6: this.setearElEstadoVendidoONo(lote.sold),
                      id: lote.id,
                    });
                    this.lotes.push(lote);
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
        },
        (err) => {
          Swal.fire(
            'Error',
            'Tuvimos un error desconocido, por favor intenta recargar la página o espera un rato.',
            'error'
          );
        }
      );
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
    this.lotesService
      .createLote(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          if (res?.meta?.status === 200 || res?.meta?.status === 201) {
            this.recargarLotes(true);
            Swal.fire(
              '¡Excelente!',
              'Creamos el lote sin problemmas.',
              'success'
            );
          }
        },
        () => {
          this.isCreating = false;
          this.isEditing = false;
          this.recargarLotes(true);
          Swal.fire(
            'Error',
            'Tuvimos un error desconocido, por favor intenta recargar la página o espera un rato.',
            'error'
          );
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
    this.lotesService
      .editLote(this.loteID, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          if (res?.meta?.status === 200 || res?.meta?.status === 201) {
            this.recargarLotes(true);
            Swal.fire(
              '¡Excelente!',
              'Editamos el lote sin problemmas.',
              'success'
            );
          }
        },
        (err) => {
          console.log(err);
          this.isCreating = false;
          this.isEditing = false;
          this.recargarLotes(true);
          Swal.fire(
            'Error',
            'Tuvimos un error desconocido, por favor intenta recargar la página o espera un rato.',
            'error'
          );
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
    this.lotesService
      .deleteLote(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.recargarLotes(true);
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
