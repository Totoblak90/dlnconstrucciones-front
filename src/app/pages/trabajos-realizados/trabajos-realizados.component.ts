import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { TypesOfJobs, TypesOfJobsData } from '../../interfaces/http/jobs.interface';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PresentationCard } from 'src/app/interfaces/presentation-card.interface';

@Component({
  selector: 'app-trabajos-realizados',
  templateUrl: './trabajos-realizados.component.html',
  styleUrls: ['./trabajos-realizados.component.scss']
})
export class TrabajosRealizadosComponent implements OnInit, OnDestroy {

  public trabajosComplete!: TypesOfJobs;
  public trabajosData: TypesOfJobsData[] = [];
  public trabajoDataToPresent: PresentationCard[] = [];
  private destroy$: Subject<boolean> = new Subject();

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    this.httpService.getTypesOfJob()
      .pipe(takeUntil(this.destroy$))
      .subscribe((jobCategories: TypesOfJobs) => {
        this.trabajosComplete = jobCategories;
        this.trabajosData = jobCategories?.data;
        this.trabajosData?.forEach(trabajo => {
          trabajo.url = `/trabajos-realizados/${trabajo.id}`
          trabajo.image = `${environment.API_IMAGE_URL}/${trabajo.image}`
        })
        this.mapTrabajosRealizadosToPresent();
      })
  }

  private mapTrabajosRealizadosToPresent(): void {
    this.trabajosData.forEach( trabajo => {
      this.trabajoDataToPresent.push({
        titulo: trabajo.title,
        urlFoto: trabajo.image,
        ruta: trabajo.url
      })
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
