import { Component, OnDestroy, OnInit } from '@angular/core';
import { concat, Subject } from 'rxjs';
import {
  Job,
  TypesOfJobs,
} from 'src/app/modules/main/interfaces/http/jobs.interface';
import { CuerpoTabla } from '../../interfaces/tabla.interface';
import { HttpService } from '../../../../services/http.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-trabajos-realizados',
  templateUrl: './trabajos-realizados.component.html',
  styleUrls: ['./trabajos-realizados.component.scss'],
})
export class TrabajosRealizadosComponent implements OnInit, OnDestroy {
  public encabezadosTabla: string[] = ['Título', 'Descripción'];
  public tableData: CuerpoTabla[] = [];
  public loading: boolean = true;
  private destroy$: Subject<boolean> = new Subject();

  constructor(private httpSrv: HttpService) {}

  ngOnInit(): void {
    this.getTrabajos();
  }

  private getTrabajos(): void {
    this.httpSrv
      .getTypesOfJob()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: TypesOfJobs) => {
        concat(
          this.httpSrv.getOneTypeOfJob(res?.data[0].id.toString()),
          this.httpSrv.getOneTypeOfJob(res?.data[1].id.toString())
        )
          .pipe(
            takeUntil(this.destroy$),
            finalize(() => (this.loading = false))
          )
          .subscribe((res: Job) => {
            this.tableData = res?.data?.Jobs.map((job) => {
              return {
                imagen: `${environment.API_IMAGE_URL}/${job.image}`,
                item2: job.title ? job.title : 'Vacío',
                item3: job.description ? job.description : 'Vacío'
              };
            });
          });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
