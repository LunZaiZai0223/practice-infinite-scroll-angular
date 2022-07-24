import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AirlineServiceService } from 'src/app/services/airline-service.service';
import { Airlines } from '../../interfaces/Airline.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('scrollChild') theLastScrollChild!: QueryList<ElementRef>;
  @ViewChild('anchor') anchor!: ElementRef<HTMLElement>;

  airlineList: Airlines[] = [];
  currentPage: number = 0;
  apiPage: number = 0;

  private observer!: IntersectionObserver;
  private listSubscription: Subscription = new Subscription();

  constructor(private _airlineService: AirlineServiceService) {}

  ngOnInit(): void {
    this.fetchAirlineData();
  }

  ngAfterViewInit(): void {
    this.theLastScrollChild.changes.subscribe(list => {
      console.log(list);
      if (list.last) {
        console.log(list.last.nativeElement);
        this.observer.observe(list.last.nativeElement);
      }
    });

    this.initObserver();
  }

  ngOnDestroy(): void {
    this.listSubscription.unsubscribe();
  }

  private fetchAirlineData(page?: number): void {
    this.listSubscription = this._airlineService.fetchAirline(page).subscribe(data => {
      this.setAirlineList(this.getFlattenedData(data.data));
    });
  }

  private getFlattenedData(originalData: any): Airlines[] {
    const result: Airlines[] = [];
    originalData.forEach((airlineWrapper: any) => {
      const [airline] = airlineWrapper.airline;
      result.push(airline);
    });
    return result;
  }

  private setAirlineList(flattenedData: Airlines[]): void {
    this.airlineList = flattenedData;
  }

  private initObserver(): void {
    const config = {
      root: this.anchor.nativeElement,
      rootMargin: '0px 0px 50% 0px',
      threshold: 0,
    };

    console.log(config);
    this.observer = new IntersectionObserver(([entry]) => {
      console.log(entry);
    }, config);
  }
}
