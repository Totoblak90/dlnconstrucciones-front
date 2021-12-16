import { Component, Host, HostBinding, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UsersService } from '../../services/users.service';
import { takeUntil } from 'rxjs/operators';
import { AllUsersRes } from '../../interfaces/users.interface';
import Swal from 'sweetalert2';
import { HttpService } from '../../../../services/http.service';
import {
  Batch,
  PostalZones,
} from 'src/app/modules/main/interfaces/http/batches.interface';
import { Services, ServicesData } from 'src/app/modules/main/interfaces/http/services.interface';
import { Job, JobMoreInfo, TypesOfJobs } from 'src/app/modules/main/interfaces/http/jobs.interface';
import { User } from 'src/app/models/user.model';
import { AuthService } from '../../../main/services/auth.service';

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
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getLoggedUser();
    this.getAllUsers();
    this.getAllLotes();
    this.getAllServices();
    this.getTrabajos();
  }

  private getLoggedUser(): void {
    this.user = this.authService.getUser();
  }

  private getAllUsers(): void {
    this.usersService
      .getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: AllUsersRes) => (this.cantidadDeUsuarios = res?.data.length),
        (err) =>
          Swal.fire(
            'Error',
            'No pudimos cargar los usuarios, por favor intentalo nuevamente',
            'error'
          )
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
                (lotes) => {
                  lotes?.data?.Batches?.forEach((lote) => {
                    this.lotes.push(lote);
                  });
                },
                () =>
                  Swal.fire(
                    'Error',
                    'No pudimos cargar los lotes, por favor intentalo nuevamente',
                    'error'
                  )
              );
          }
        },
        () =>
          Swal.fire(
            'Error',
            'No pudimos cargar los lotes, por favor intentalo nuevamente',
            'error'
          )
      );
  }

  private getAllServices(): void {
    this.httpService
      .getAllServices()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: Services) => {
          res?.data?.forEach(servicio => this.servicios.push(servicio))
        },
        (err) => console.log(err)
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
            .pipe(
              takeUntil(this.destroy$)
            )
            .subscribe((job: Job) => {
              job?.data?.Jobs.forEach((j: JobMoreInfo) => {
                this.trabajos.push(j)
              });
            });
        }
      });
  }
}
