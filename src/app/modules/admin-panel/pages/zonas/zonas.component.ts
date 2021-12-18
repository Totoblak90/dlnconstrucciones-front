import { Component, Host, HostBinding, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CuerpoTabla } from '../../interfaces/tabla.interface';
import { HttpService } from '../../../../services/http.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { PostalZones } from 'src/app/modules/main/interfaces/http/batches.interface';
import Swal from 'sweetalert2';

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
  private destroy$: Subject<boolean> = new Subject();

  constructor(private httpSrv: HttpService) {}

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
              imagen: zona.image,
              item2: zona.title,
              id: zona.id,
            });
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

  public recargarZonas(recargar: boolean): void {
    if (recargar) {
      this.tableData = [];
      this.getZonas();
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
