import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';
import { Interests, InterestsData } from '../../interfaces/http/interests.interface';

@Component({
  selector: 'app-wheel-modal',
  templateUrl: './wheel-modal.component.html',
  styleUrls: ['./wheel-modal.component.scss']
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
      (interestsFull) => {
        this.interestsComplete = interestsFull;
        this.interestsData = interestsFull.data;
        this.interestsData?.forEach(
          (interest) =>
            (interest.image = `${environment.API_IMAGE_URL}/${interest.image}`)
        );
      },
      (err) => console.log(err)
    );
  }

}
