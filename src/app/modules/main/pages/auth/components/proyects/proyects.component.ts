import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { User } from '../../../../../../models/user.model';
import { Project } from '../../../../../admin-panel/interfaces/users.interface';

@Component({
  selector: 'app-proyects',
  templateUrl: './proyects.component.html',
  styleUrls: ['./proyects.component.scss'],
})
export class ProyectsComponent {
  @Input() public user!: User;

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

  public setAssetUrl(assetName: string): string {
    return `${environment.API_IMAGE_URL}/${assetName}`;
  }

  public descargarCashFlow(cashflow: string): void {
    console.log(cashflow);
  }

  public checkProyect(data: Project) {
    console.log(data);
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
