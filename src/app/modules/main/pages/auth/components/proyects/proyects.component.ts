import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { customMessageAlert } from 'src/app/helpers/alerts';
import Swal from 'sweetalert2';
import { User } from '../../../../../../models/user.model';
import {
  Project,
  ProyectAssets,
} from '../../../../../admin-panel/interfaces/users.interface';
import { ProjectsService } from '../../../../../admin-panel/services/projects.service';

@Component({
  selector: 'app-proyects',
  templateUrl: './proyects.component.html',
  styleUrls: ['./proyects.component.scss'],
})
export class ProyectsComponent {
  @Input() public user!: User;
  @Output() public onDownloadCashflow: EventEmitter<string> =
    new EventEmitter();
  private assetCallCounter: number = 0;

  constructor(private projectsService: ProjectsService) {}

  public get encabezados(): string[] {
    let propiedadesDePayments: string[] = [];
    const encabezados = [];

    this.user.projects?.forEach((pr) =>
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
    this.user?.projects?.forEach((pr) => {
      const num: number = this.setPers(pr.total, pr.balance);
      pb_Style.push(`width: ${num}%`);
    });
    return pb_Style;
  }

  public get porcentaje(): number[] {
    const porcentajes: number[] = [];
    this.user?.projects?.forEach((pr) => {
      const num: number = this.setPers(pr.total, pr.balance);
      porcentajes.push(num);
    });
    return porcentajes;
  }

  private setPers(total: number, pagado: number): number {
    let result: number = total - pagado;
    result = (result * 100) / total;
    return Math.round(result);
  }

  public setAssetUrl(proyecto: Project, asset: ProyectAssets): void {
    let proj: Project | undefined;
    let archivo: ProyectAssets | undefined;
    let countErrors: number = 0;
    if (this.assetCallCounter !== proyecto.Assets.length) {
      proj = this.user.projects?.find((p) => p.id === proyecto.id);
      archivo = proj?.Assets.find((a) => a.id === asset.id);
      this.assetCallCounter++;
      if (archivo?.asset) {
        this.projectsService.getAssetsDeUnProyecto(archivo?.asset).subscribe({
          next: (blob) => this.setImageOrVideoSrcAttribute(blob, asset),
          error: () => {
            countErrors++;
            if (
              this.assetCallCounter === proyecto.Assets.length &&
              countErrors > 0
            ) {
              customMessageAlert(
                'Error',
                'Tuvimos un error desconocido y no pudimos cargar uno o ningún archivo de tu galería de proyecto. Te pedimos recargues la página o esperes un tiempo',
                'OK',
                'error'
              );
            }
          },
        });
      }
    }
  }

  private setImageOrVideoSrcAttribute(blob: Blob, asset: ProyectAssets): void {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      this.user.projects?.forEach((proj) => {
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
