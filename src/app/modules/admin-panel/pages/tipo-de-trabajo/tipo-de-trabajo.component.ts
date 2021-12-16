import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CuerpoTabla } from '../../interfaces/tabla.interface';
import { HttpService } from '../../../../services/http.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { TypesOfJobs } from 'src/app/modules/main/interfaces/http/jobs.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tipo-de-trabajo',
  templateUrl: './tipo-de-trabajo.component.html',
  styleUrls: ['./tipo-de-trabajo.component.scss'],
})
export class TipoDeTrabajoComponent implements OnInit {
  public encabezadosTabla: string[] = ['Título'];
  public tableData: CuerpoTabla[] = [];
  public loading: boolean = true;
  private destroy$: Subject<boolean> = new Subject();

  constructor(private httpSrv: HttpService) {}

  ngOnInit(): void {
    this.getTiposDeTrabajo();
  }

  private getTiposDeTrabajo(): void {
    this.httpSrv
      .getTypesOfJob()
      .pipe(takeUntil(this.destroy$), finalize(() => this.loading = false))
      .subscribe((typesOfJob: TypesOfJobs) => {
        typesOfJob.data.forEach((typeOfJob) => {
          this.tableData.push({
            imagen: `${environment.API_IMAGE_URL}/${typeOfJob.image}`,
            item2: typeOfJob.title,
          });
        });
      });
  }

  public recargarTrabajos(recargar: boolean): void {
    if (recargar) {
      this.tableData = [];
      this.getTiposDeTrabajo();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
