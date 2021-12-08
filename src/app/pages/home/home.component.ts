import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Interests, InterestsData } from '../../interfaces/http/interests.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public interestsComplete!: Interests;
  public interestsData: InterestsData[] = [];
  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private http: HttpService
  ) {}

  ngOnInit(): void {
    this.http.getInterests()
    .pipe(takeUntil(this.destroy$))
      .subscribe(interestsFull => {
        this.interestsComplete = interestsFull;
        this.interestsData = interestsFull.data;
        this.interestsData?.forEach(interest => interest.image = `${environment.API_IMAGE_URL}/${interest.image}`)
      }, err => console.log(err))
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
