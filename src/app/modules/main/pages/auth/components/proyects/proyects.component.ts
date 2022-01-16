import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { User } from '../../../../../../models/user.model';
import {
  Project,
  ProyectAssets,
} from '../../../../../admin-panel/interfaces/users.interface';
import { ProjectsService } from '../../../../../admin-panel/services/projects.service';
import { unknownErrorAlert } from '../../../../../../helpers/alerts';
import { Galeria } from '../../../../../admin-panel/interfaces/projects.interface';

@Component({
  selector: 'app-proyects',
  templateUrl: './proyects.component.html',
  styleUrls: ['./proyects.component.scss'],
})
export class ProyectsComponent implements OnInit {
  @Input() public set setProyectos(user: User) {
    if (user && user.projects) {
      this.proyectos = user.projects;
    }
  }
  @Output() public onDownloadCashflow: EventEmitter<string> =
    new EventEmitter();

  public proyectos: Project[] = [];
  public assets: Galeria[] = [];
  private destroy$: Subject<boolean> = new Subject();

  constructor(private projectsService: ProjectsService) {}

  ngOnInit(): void {
      this.setAssets()
  }

  private setAssets(): void {
    this.proyectos?.forEach((proj) => {
      proj.Assets.forEach((asset) => {
        this.projectsService
          .getAssetsDeUnProyecto(asset.asset)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (blob) => {
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onload = () => {
                this.assets.push({
                  base64: reader.result as string,
                  project_id: proj.id,
                  type: blob.type,
                  asset_id: asset.id,
                });
              };
            },
            error: (err) => unknownErrorAlert(err),
          });
      });
    });
  }

  public showGalleryCard(asset: Galeria, proyecto: Project): boolean {
    return asset.project_id === proyecto.id;
  }

  public showGalleryImage(asset: Galeria, proyecto: Project): boolean {
    return asset.type.includes('image') && asset.project_id === proyecto.id;
  }

  public showGalleryVideo(asset: Galeria, proyecto: Project): boolean {
    return asset.type.includes('video') && asset.project_id === proyecto.id;
  }

  public get encabezados(): string[] {
    let propiedadesDePayments: string[] = [];
    const encabezados = [];

    this.proyectos?.forEach((pr) =>
      pr.Payments?.forEach((pay) => (propiedadesDePayments = Object.keys(pay)))
    );
    if (propiedadesDePayments?.length) {
      for (const item of propiedadesDePayments) {
        switch (item) {
          case 'amount':
            encabezados.push('Monto');
            break;
          case 'receipt':
            encabezados.push('Comprobante');
            break;
          case 'datetime':
            encabezados.push('Fecha');
            break;
          default:
            break;
        }
      }
    }

    encabezados.sort();

    return encabezados;
  }

  public get progressBarStyle(): string[] {
    const pb_Style: string[] = [];
    this.proyectos?.forEach((pr) => {
      const num: number = this.setPorcentaje(pr.total, pr.balance);
      pb_Style.push(`width: ${num}%`);
    });
    return pb_Style;
  }

  public get porcentaje(): number[] {
    const porcentajes: number[] = [];
    this.proyectos?.forEach((pr) => {
      const num: number = this.setPorcentaje(pr.total, pr.balance);
      porcentajes.push(num);
    });
    return porcentajes;
  }

  private setPorcentaje(total: number, pagado: number): number {
    let result: number = total - pagado;
    result = (result * 100) / total;
    return Math.round(result);
  }

  private setImageOrVideoSrcAttribute(blob: Blob, asset: ProyectAssets): void {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      this.proyectos?.forEach((proj) => {
        proj.Assets.forEach((ar) => {
          if (ar.id === asset.id) {
            ar.asset = reader.result as string;
          }
        });
      });
    };
  }

  public descargarCashFlow(cashflow: string): void {
    this.onDownloadCashflow.emit(cashflow);
  }

  public expandImage(img: string) {
    Swal.fire({
      imageUrl: img,
      imageWidth: 400,
      imageHeight: 400,
      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp',
      },
    });
  }
}
