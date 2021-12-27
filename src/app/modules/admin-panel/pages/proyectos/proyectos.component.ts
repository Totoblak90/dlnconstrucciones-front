import { Component, Host, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { UsersService } from '../../services/users.service';
import Swal from 'sweetalert2';
import {
  AllUsersRes,
  FullUser,
  Project,
} from '../../interfaces/users.interface';
import { environment } from 'src/environments/environment';
import { CuerpoTabla } from '../../interfaces/tabla.interface';
import { Router } from '@angular/router';
import { AdminPanelCrudService } from '../../services/admin-panel-crud.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss'],
})
export class ProyectosComponent implements OnInit, OnDestroy {
  @HostBinding('class.admin-panel-container') someClass: Host = true;

  public projects: Project[] = [];
  public tableData: CuerpoTabla[] = [];
  public encabezadosTabla: string[] = [
    'Nombre del proyecto',
    'Total',
    'Debe',
    'Usuario',
  ];
  public loading: boolean = true;

  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private usersService: UsersService,
    private currencyPipe: CurrencyPipe
  ) {}

  ngOnInit(): void {
    this.getProyects();
  }

  private getProyects(): void {
    this.usersService
      .getAllProjects()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (res) => {
          if (res?.meta?.status.toString().includes('20')) {
            this.projects = res?.data;
            this.setTableData();
          } else {
            Swal.fire(
              '¡Lo sentimos!',
              'No pudimos cargar la información, por favor recarga la página',
              'error'
            );
          }
        },
        () =>
          Swal.fire(
            '¡Lo sentimos!',
            'No pudimos cargar la información, por favor recarga la página',
            'error'
          )
      );
  }

  private setTableData(): void {
    this.projects.forEach((proyecto) =>
      this.tableData.push({
        imagen: '../../../../../assets/no-image.png',
        id: proyecto.id,
        item2: proyecto.title
          ? proyecto.title
          : `Proyecto usuario: ${proyecto.Users?.first_name} ${proyecto.Users?.last_name}`,
        item3: proyecto.total ? this.setCurrencyFormat(proyecto.total) : 'NULL',
        item4:
          proyecto.balance !== null || proyecto.balance !== undefined
            ? this.setCurrencyFormat(proyecto.balance)
            : 'NULL',
        item6: `${proyecto.Users?.first_name} ${proyecto.Users?.last_name}`,
      })
    );
  }

  private setCurrencyFormat(total: number): string {
    return this.currencyPipe.transform(total, '$')!;
  }

  public recargarProyectos(recargar: boolean) {
    if (recargar) {
      this.tableData = [];
      this.getProyects();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
