import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';
import {
  Interests,
  InterestsData,
} from '../../interfaces/http/interests.interface';
import {
  noConnectionAlert,
  unknownErrorAlert,
} from '../../../../helpers/alerts';

@Component({
  selector: 'app-wheel-modal',
  templateUrl: './wheel-modal.component.html',
  styleUrls: ['./wheel-modal.component.scss'],
})
export class WheelModalComponent implements OnInit {
  private interestsComplete!: Interests;
  public interestsData: InterestsData[] = [];

  private destroy$: Subject<boolean> = new Subject();

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.getInterests();
  }

  private getInterests(): void {
    this.http
      .getInterests()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (interestsFull: Interests) => {
          interestsFull.meta.status.toString().includes('20')
            ? this.setInterests(interestsFull)
            : unknownErrorAlert();
        },
        () => noConnectionAlert()
      );
  }

  private setInterests(interests: Interests): void {
    this.interestsComplete = interests;
    this.interestsData = interests.data;
    this.interestsData?.forEach(
      (interest: InterestsData) =>
        (interest.image = `${environment.API_IMAGE_URL}/${interest.image}`)
    );
  }
}
