import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-spinner',
  template: `
    <div class="overlay" *ngIf="isLoading$ | async">
      <div class="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  `,
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
  public isLoading$: Subject<boolean> = this.spinnerService.isLoading$;

  constructor(private spinnerService: SpinnerService) {}
}
