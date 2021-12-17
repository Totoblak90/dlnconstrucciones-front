import { Component, EventEmitter, Host, HostBinding, Input, OnInit, Output } from '@angular/core';
import { CuerpoTabla } from '../../interfaces/tabla.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {

  @Output() onRecargar: EventEmitter<boolean> = new EventEmitter();
  @Input() title: string = '';
  @Input() totalSection: number = 0;
  @Input() encabezadosTabla: string[] = [];
  @Input() filasTabla: CuerpoTabla[] = [];
  @Input() loading: boolean = true;

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

  public sendData(): void {

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
