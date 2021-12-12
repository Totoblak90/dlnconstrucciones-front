import { Component, OnDestroy, OnInit } from '@angular/core';
import { concat, Subject } from 'rxjs';
import { HttpService } from '../../../../services/http.service';
import { CuerpoTabla } from '../../interfaces/tabla.interface';
import { takeUntil, finalize } from 'rxjs/operators';
import {
  Services,
  TipoServicio,
} from 'src/app/modules/main/interfaces/http/services.interface';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss'],
})
export class ServiciosComponent implements OnInit, OnDestroy {
  public encabezadosTabla: string[] = ['Título'];
  public tableData: CuerpoTabla[] = [];
  public loading: boolean = true;
  private destroy$: Subject<boolean> = new Subject();

  constructor(private httpSrv: HttpService) {}

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
            });
          });
        },
        (err) => {
          Swal.fire(
            '¡Lo sentimos!',
            'No pudimos cargar los servicios como esperabamos, intentá de nuevo y sino ponete en contacto con tu proveedor de internet',
            'warning'
          );
        }
      );
  }

  public recargarServicios(recargar: boolean): void {
    if (recargar) {
      this.tableData = [];
      this.getServicios();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
