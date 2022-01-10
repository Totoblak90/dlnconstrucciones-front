import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  public isLoading$: Subject<boolean> = new Subject();

  public showSpinner(): void {
    this.isLoading$.next(true);
  }
  public hideSpinner(): void {
    this.isLoading$.next(false);
  }
}
