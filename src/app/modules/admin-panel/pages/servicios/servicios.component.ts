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

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss'],
})
export class ServiciosComponent implements OnInit, OnDestroy {
  public encabezadosTabla: string[] = ['Título', 'Descripción'];
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
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (servicios: Services) => {
          for (const servicio of servicios.data) {
            this.httpSrv
              .getOneService(servicio.id.toString())
              .pipe(
                takeUntil(this.destroy$),
                finalize(() => (this.loading = false))
              )
              .subscribe(
                (tipoServicio: TipoServicio) => {
                  tipoServicio?.data?.Contents.map((servicio) => {
                    this.tableData.push({
                      imagen: `${environment.API_IMAGE_URL}/${tipoServicio.data.image}`,
                      item2: servicio.subtitle ? servicio.subtitle : 'Vacío',
                      item3: servicio.text ? servicio.text : 'Vacío',
                    });
                  });
                },
                (err) => console.log(err)
              );
          }
        },
        (err) => console.log(err, 'primer error')
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
