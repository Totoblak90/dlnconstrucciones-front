import { Component, Host, HostBinding, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UsersService } from '../../services/users.service';
import { takeUntil } from 'rxjs/operators';
import { AllUsersRes } from '../../interfaces/users.interface';
import { HttpService } from '../../../../services/http.service';
import {
  Batch,
  Lotes,
  PostalZones,
} from 'src/app/modules/main/interfaces/http/batches.interface';
import {
  Services,
  ServicesData,
} from 'src/app/modules/main/interfaces/http/services.interface';
import {
  Job,
  JobMoreInfo,
  TypesOfJobs,
} from 'src/app/modules/main/interfaces/http/jobs.interface';
import { User } from 'src/app/models/user.model';
import { AuthService } from '../../../main/services/auth.service';
import { UserStoreService } from '../../../../services/user-store.service';
import {
  noConnectionAlert,
  customMessageAlert,
  unknownErrorAlert,
} from '../../../../helpers/alerts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @HostBinding('class.admin-panel-container') someClass: Host = true;

  public user!: User;
  public cantidadDeUsuarios: number = 0;
  public lotes: Batch[] = [];
  public servicios: ServicesData[] = [];
  public trabajos: JobMoreInfo[] = [];
  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private usersService: UsersService,
    private httpService: HttpService,
    private userStore: UserStoreService
  ) {
    this.getLoggedUser();
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.getAllLotes();
    this.getAllServices();
    this.getTrabajos();
  }

  private getLoggedUser(): void {
    this.userStore.loggedUser$.subscribe((res) => {
      this.user = res;
    });
  }

  private getAllUsers(): void {
    this.usersService
      .getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: AllUsersRes) =>
          res?.meta?.status.toString().includes('20')
            ? (this.cantidadDeUsuarios = res?.data.length)
            : customMessageAlert(
                'Error',
                'Probá tu conexión a internet o ponete en contacto con tu proveedor del mismo. Si el problema persiste, ponete en contacto con el administrador de la página',
                'OK',
                'error'
              ),
        (err) => noConnectionAlert(err)
      );
  }

  private getAllLotes(): void {
    this.httpService
      .getAllZones()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: PostalZones) => {
          for (const zona of res?.data) {
            this.httpService
              .getLotes(zona.id.toString())
              .pipe(takeUntil(this.destroy$))
              .subscribe(
                (lotes: Lotes) =>
                  lotes?.meta?.status.toString().includes('20')
                    ? lotes?.data?.Batches?.forEach((lote: Batch) => {
                        this.lotes.push(lote);
                      })
                    : customMessageAlert(
                        'Error',
                        'Probá tu conexión a internet o ponete en contacto con tu proveedor del mismo. Si el problema persiste, ponete en contacto con el administrador de la página',
                        'OK',
                        'error'
                      ),
                (err) => noConnectionAlert(err)
              );
          }
        },
        (err) => noConnectionAlert(err)
      );
  }

  private getAllServices(): void {
    this.httpService
      .getAllServices()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: Services) =>
          res?.meta.status.toString().includes('20')
            ? res?.data?.forEach((servicio) => this.servicios.push(servicio))
            : customMessageAlert(
                'Error',
                'Probá tu conexión a internet o ponete en contacto con tu proveedor del mismo. Si el problema persiste, ponete en contacto con el administrador de la página',
                'OK',
                'error'
              ),
        (err) => noConnectionAlert(err)
      );
  }

  private getTrabajos(): void {
    this.httpService
      .getTypesOfJob()
      .pipe(takeUntil(this.destroy$))
      .subscribe((typesOfJobs: TypesOfJobs) => {
        for (const typeOfJob of typesOfJobs.data) {
          this.httpService
            .getOneTypeOfJob(typeOfJob.id.toString())
            .pipe(takeUntil(this.destroy$))
            .subscribe(
              (job: Job) =>
                job?.meta.status.toString().includes('20')
                  ? job?.data?.Jobs.forEach((j: JobMoreInfo) => {
                      this.trabajos.push(j);
                    })
                  : customMessageAlert(
                      'Error',
                      'Probá tu conexión a internet o ponete en contacto con tu proveedor del mismo. Si el problema persiste, ponete en contacto con el administrador de la página',
                      'OK',
                      'error'
                    ),
              (err) => noConnectionAlert(err)
            );
        }
      });
  }
}
