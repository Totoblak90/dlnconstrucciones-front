import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { User } from '../../../../../../models/user.model';
import { Project } from '../../../../../admin-panel/interfaces/users.interface';
import { ProjectsService } from '../../../../../admin-panel/services/projects.service';
import { unknownErrorAlert } from '../../../../../../helpers/alerts';
import { Galeria } from '../../../../../admin-panel/interfaces/projects.interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-proyects',
  templateUrl: './proyects.component.html',
  styleUrls: ['./proyects.component.scss'],
  providers: [CurrencyPipe],
})
export class ProyectsComponent implements OnInit {
  @Input() public set setProyectos(user: User) {
    if (user && user.projects) {
      this.proyectos = user.projects;
    }
  }
  @Output() public onDownloadCashflow: EventEmitter<string> =
    new EventEmitter();
  public encabezados: string[] = [
    'Descripción',
    'Detalle de pago',
    'Fecha',
    'Factura',
    'Moneda',
    'Subtotal',
    'IVA',
    'Total',
    'Cotización USD',
    'Total en USD',
  ];
  public proyectos: Project[] = [];
  public assets: Galeria[] = [];
  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private projectsService: ProjectsService,
    private currencyPipe: CurrencyPipe
  ) {}

  ngOnInit(): void {
    this.setAssets();
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

  public setDolarCodeFormat(value: string | undefined): string {
    value = this.currencyPipe.transform(value, 'USD', 'code')!;

    value = value.substring(0, 3) + ' ' + value.substring(3, value.length);

    return value!;
  }

  public setFormatAcordingToPaymentMethod(
    value: string,
    coinCode: string
  ): string {
    if (coinCode === 'USD') {
      value = this.currencyPipe.transform(value, 'USD', 'code')!;
    } else {
      value = this.currencyPipe.transform(value)!;
    }

    if (value.includes('USD')) {
      value = value.substring(0, 3) + ' ' + value.substring(3, value.length);
    }
    return value;
  }

  private setPorcentaje(total: number, pagado: number): number {
    let result: number = total - pagado;
    result = (result * 100) / total;
    return Math.round(result);
  }

  public descargarCashFlow(cashflow: string): void {
    this.onDownloadCashflow.emit(cashflow);
  }

  public setFileToDownloadIcon(filename: string): string {
    if (filename.includes('.pdf')) return '../../../../../assets/pdficon.png';
    else if (filename.includes('.xls') || filename.includes('.xlsx'))
      return '../../../../../assets/excelicon.png';
    else if (filename.includes('.doc') || filename.includes('.docx'))
      return '../../../../../assets/word.png';
    else if (
      filename.includes('.png') ||
      filename.includes('.jpg') ||
      filename.includes('.jpeg')
    )
      return '../../../../../assets/mediafile.png';

    return '';
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
