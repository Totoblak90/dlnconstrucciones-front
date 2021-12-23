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
import { FormGroup } from '@angular/forms';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { TrabajosRealizadosAdminService } from '../../services/trabajos-realizados-admin.service';

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
  public jobForm!: FormGroup;
  public isCreating: boolean = false;
  public isEditing: boolean = false;
  public crudAction: string = ''
  public imageToShow: string = '';
  public acceptedFileTypes: boolean = false;
  public categoriaDeTrabajo: any;
  private destroy$: Subject<boolean> = new Subject();

  constructor(private httpSrv: HttpService, private trabajosRealizadosAdminService: TrabajosRealizadosAdminService) {
    this.createForm();
  }

  private createForm() {

  }

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

  public crearTrabajoRealizado(): void {

  }
  public editarTrabajoRealizado(id: number): void {

  }
  public borrarTrabajoRealizado(id: number): void {
      Swal.fire({
        title: '¿Seguro querés elimninar el trabajo seleccionado?',
        showDenyButton: true,
        confirmButtonText: 'Si, borrar',
        denyButtonText: `No`,
      }).then((result: SweetAlertResult<any>) => {
        result.isConfirmed ? this.borrarTrabajoDeLaDb(id) : null;
      });
  }

  private borrarTrabajoDeLaDb(id: number): void {
    this.trabajosRealizadosAdminService
      .borrarTrabajoRealizado(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.recargarTrabajos(true);
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

  public formSubmit() {

  }

  public showSelectedImage(e: any) {

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
