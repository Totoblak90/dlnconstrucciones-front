import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CuerpoTabla } from '../../interfaces/tabla.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @Output() private onCreate: EventEmitter<undefined> = new EventEmitter();
  @Output() private onEdit: EventEmitter<number> = new EventEmitter();
  @Output() private onDelete: EventEmitter<number> = new EventEmitter();
  @Output() private onRecargar: EventEmitter<boolean> = new EventEmitter();
  @Output() private onAddPayments: EventEmitter<number> = new EventEmitter();
  @Output() private onAddAssets: EventEmitter<number> = new EventEmitter();
  @Output() private onAddContents: EventEmitter<number> = new EventEmitter();

  @Input() public title: string = '';
  @Input() public totalSection: number = 0;
  @Input() public encabezadosTabla: string[] = [];
  @Input() public filasTabla: CuerpoTabla[] = [];
  @Input() public noImage?: boolean = false;
  @Input() public addAssets?: boolean = false;
  @Input() public addPayments?: boolean = false;
  @Input() public addContents?: boolean = false;

  public searching: boolean = false;
  public searchingResults: number = 0;

  public expandirImagen(imagen: string): void {
    Swal.fire({
      imageUrl: imagen,
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

  public verMas(info: string): void {
    if (info.length > 100) {
      Swal.fire({
        text: info,
        showClass: {
          popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp',
        },
      });
    }
  }

  public create(): void {
    this.onCreate.emit();
  }

  public edit(value: number): void {
    this.onEdit.emit(value);
  }

  public delete(value: number): void {
    this.onDelete.emit(value);
  }

  public addPayment(value: number): void {
    this.onAddPayments.emit(value);
  }

  public addAsset(value: number): void {
    this.onAddAssets.emit(value);
  }

  public addContent(id: number): void {
    this.onAddContents.emit(id);
  }

  public search(term: string): void {
    this.searching = true;

    if (!term) {
      this.onRecargar.emit(true);
      this.searching = false;
      return;
    }

    this.filasTabla = this.filasTabla.filter((data) => {
      return (
        data.item2
          ?.toLocaleLowerCase()
          .trim()
          .includes(term.toLocaleLowerCase().trim()) ||
        data.item3
          ?.toLocaleLowerCase()
          .trim()
          .includes(term.toLocaleLowerCase().trim()) ||
        data.item4
          ?.toLocaleLowerCase()
          .trim()
          .includes(term.toLocaleLowerCase().trim()) ||
        data.item6
          ?.toLocaleLowerCase()
          .trim()
          .includes(term.toLocaleLowerCase().trim()) ||
        data.item7
          ?.toLocaleLowerCase()
          .trim()
          .includes(term.toLocaleLowerCase().trim()) ||
        data.item8
          ?.toLocaleLowerCase()
          .trim()
          .includes(term.toLocaleLowerCase().trim()) ||
        data.item9
          ?.toLocaleLowerCase()
          .trim()
          .includes(term.toLocaleLowerCase().trim()) ||
        data.item10
          ?.toLocaleLowerCase()
          .trim()
          .includes(term.toLocaleLowerCase().trim())
      );
    });
    this.searchingResults = this.filasTabla.length;
  }
}
