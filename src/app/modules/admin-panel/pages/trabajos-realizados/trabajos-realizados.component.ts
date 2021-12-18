import { Component, Host, HostBinding, OnDestroy, OnInit } from '@angular/core';
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
  @HostBinding('class.admin-panel-container') someClass: Host = true;

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
      .subscribe((typesOfJobs: TypesOfJobs) => {
        for (const typeOfJob of typesOfJobs.data) {
          this.httpSrv
            .getOneTypeOfJob(typeOfJob.id.toString())
            .pipe(
              takeUntil(this.destroy$),
              finalize(() => (this.loading = false))
            )
            .subscribe((job: Job) => {
              job?.data?.Jobs.forEach((j) => {
                this.tableData.push({
                  imagen: `${environment.API_IMAGE_URL}/${j.image}`,
                  item2: j.title ? j.title : 'Vacío',
                  item3: j.description ? j.description : 'Vacío',
                  id: j.id
                });
              });
            });
        }
      });
  }

  public recargarTrabajos(recargar: boolean): void {
    if (recargar) {
      this.tableData = [];
      this.getTrabajos();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
