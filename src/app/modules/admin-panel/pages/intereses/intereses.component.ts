import { Component, Host, HostBinding, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CuerpoTabla } from '../../interfaces/tabla.interface';
import { HttpService } from '../../../../services/http.service';
import { finalize, takeUntil } from 'rxjs/operators';
import {
  Interests,
  InterestsData,
} from 'src/app/modules/main/interfaces/http/interests.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-intereses',
  templateUrl: './intereses.component.html',
  styleUrls: ['./intereses.component.scss'],
})
export class InteresesComponent implements OnInit {
  @HostBinding('class.admin-panel-container') someClass: Host = true;

  public encabezadosTabla: string[] = ['Título', 'Descripción'];
  public tableData: CuerpoTabla[] = [];
  public loading: boolean = true;
  private destroy$: Subject<boolean> = new Subject();

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.getIntereses();
  }

  private getIntereses(): void {
    this.httpService
      .getInterests()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loading = false))
      )
      .subscribe((interests: Interests) => {
        interests.data.forEach((int: InterestsData) => {
          this.tableData.push({
            imagen: `${environment.API_IMAGE_URL}/${int.image}`,
            item2: int.title,
            item3: int.description,
          });
        });
      });
  }

  public recargarIntereses(recargar: boolean): void {
    if (recargar) {
      this.tableData = [];
      this.getIntereses();
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
