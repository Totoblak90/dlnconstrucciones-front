import { Component, Host, HostBinding, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CuerpoTabla } from '../../interfaces/tabla.interface';
import { HttpService } from '../../../../services/http.service';
import { takeUntil, finalize } from 'rxjs/operators';
import {
  Lotes,
  PostalZones,
} from '../../../main/interfaces/http/batches.interface';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

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
  private destroy$: Subject<boolean> = new Subject();

  constructor(private httpSrv: HttpService) {}

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
                    });
                  });
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
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
