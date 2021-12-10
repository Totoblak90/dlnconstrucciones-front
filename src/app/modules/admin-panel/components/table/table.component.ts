import { Component, Input, OnInit } from '@angular/core';
import { CuerpoTabla } from '../../interfaces/tabla.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() title: string = '';
  @Input() totalSection: number = 0;
  @Input() encabezadosTabla: string[] = [];
  @Input() filasTabla: CuerpoTabla[] = [];
  @Input() loading: boolean = true;

  public searching: boolean = false;
  public searchingResults: number = 0;

  constructor() {}

  ngOnInit(): void {}

  public expandirImagen(imagen: string): void {
    Swal.fire({
      imageUrl: imagen,
      imageWidth: 400,
      imageHeight: 400,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    })
  }

  public search(term: string): void {
    this.searching = true;
    if (!term) {
      this.searching = false;
      return;
    }
    // this.search.search('usuarios', term).subscribe((res: Search) => {
    //   this.users = res?.resultados as User[];
    //   this.searchingResults = res?.resultados?.length;
    // });
  }
}
