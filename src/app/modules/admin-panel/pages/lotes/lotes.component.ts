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
  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private httpSrv: HttpService,
    private lotesService: LotesService
  ) {}

  ngOnInit(): void {
    this.getLotes();
  }

  private getLotes(): void {
    this.httpSrv
      .getAllZones()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (zonas: PostalZones) => {
          for (const zona of zonas.data) {
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
      this.tableData = [];
      this.getLotes();
    }
  }

  public creatLote(): void {
    console.log('estoy creando');
  }

  public editarLote(id: number): void {
    if (this.encontrarLoteSeleccionado(id)) {
    }
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
        () => {
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
