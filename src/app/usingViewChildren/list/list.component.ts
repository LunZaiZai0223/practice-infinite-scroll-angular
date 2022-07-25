import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
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
  @ViewChildren('scrollChild', { read: ElementRef }) theLastScrollChild!: QueryList<ElementRef>;
  @ViewChild('anchor') anchor!: ElementRef<HTMLElement>;
  @Output() emitToggleIsFetching: EventEmitter<boolean> = new EventEmitter();

  airlineList: Airlines[] = [];
  currentPage: number = 0;
  apiPage: number = 0;
  currentObservedElement: any = null;

  private observer!: IntersectionObserver;
  private listSubscription: Subscription = new Subscription();

  constructor(private _airlineService: AirlineServiceService) {}

  ngOnInit(): void {
    this.toggleIsFetching(true);
    this.fetchAirlineData();
  }

  ngAfterViewInit(): void {
    this.theLastScrollChild.changes.subscribe(list => {
      if (list.last) {
        this.currentObservedElement = list.last.nativeElement;
        this.observer.observe(this.currentObservedElement);
      }
    });

    this.initObserver();
  }

  ngOnDestroy(): void {
    this.listSubscription.unsubscribe();
  }

  private fetchAirlineData(page?: number): void {
    this.listSubscription = this._airlineService.fetchAirline(page).subscribe(data => {
      this.currentPage += 1;
      this.setAirlineList(this.getFlattenedData(data.data));
      this.apiPage = data.totalPages;
      this.toggleIsFetching(false);
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
    this.airlineList = [...this.airlineList, ...flattenedData];
  }

  private initObserver(): void {
    const config = {
      root: this.anchor.nativeElement,
      rootMargin: '0px',
      threshold: 0,
    };

    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.observerCallback();
      }
    }, config);
  }

  private observerCallback(): void {
    this.observer.unobserve(this.currentObservedElement);
    if (this.currentPage < this.apiPage) {
      this.toggleIsFetching(true);
      this.fetchAirlineData();
    }
  }

  private toggleIsFetching(state: boolean): void {
    this.emitToggleIsFetching.emit(state);
  }
}
