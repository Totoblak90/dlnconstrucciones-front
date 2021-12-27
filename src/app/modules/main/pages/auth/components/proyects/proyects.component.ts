import { Component, Input } from '@angular/core';
import { User } from '../../../../../../models/user.model';

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
      pr.Payments.forEach((pay) => (propiedadesDePayments = Object.keys(pay)))
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
      const num: number = (pr.total - pr.balance) / 100;
      pb_Style.push(`width: ${num}%`);
    });
    return pb_Style;
  }

  public get porcentaje(): number[] {
    const porcentajes: number[] = [];
    this.user?.projects?.forEach((pr) => {
      const num: number = (pr.total - pr.balance) / 100;
      porcentajes.push(num);
    });
    return porcentajes;
  }

  public descargarCashFlow(cashflow: string): void {
    console.log(cashflow);
  }
}
