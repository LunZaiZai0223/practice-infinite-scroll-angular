import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Airlines } from 'src/app/interfaces/Airline.model';
import { AirlineServiceService } from 'src/app/services/airline-service.service';

@Component({
  selector: 'app-list-two',
  templateUrl: './list-two.component.html',
  styleUrls: ['./list-two.component.scss'],
})
export class ListTwoComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('wrapper') wrapperElement!: ElementRef<HTMLElement>;
  @ViewChild('anchor') anchor!: ElementRef<HTMLElement>;
  @Output() emitToggleIsFetching: EventEmitter<boolean> = new EventEmitter();

  airlineList: Airlines[] = [];
  currentPage: number = 0;
  apiPage: number = 0;
  currentObservedElement: any = null;
  // 防止 render 時因為資料未取得造成被觀察的 element 先出來觸發 callback 的閘門
  isFirstLoad: boolean = true;

  private observer!: IntersectionObserver;

  constructor(private _airlineService: AirlineServiceService) {}

  ngOnInit(): void {
    this.toggleIsFetching(true);
    this.fetchData();
  }

  ngAfterViewInit(): void {
    console.log(this.wrapperElement);
    console.log(this.anchor);
    this.initIntersectionObserver();
    this.observer.observe(this.anchor.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }

  private fetchData(): void {
    this._airlineService.fetchAirline().subscribe(data => {
      console.log(data);
      this.setAirlineList(this.getFlattenedData(data.data));
      console.log(this.airlineList);
      this.isFirstLoad = false;
      this.apiPage = data.totalPages;
      this.currentPage += 1;
      this.toggleIsFetching(false);
      this.observer.observe(this.anchor.nativeElement);
    });
  }

  private initIntersectionObserver(): void {
    const config = {
      root: this.wrapperElement.nativeElement,
    };

    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.observerCallback();
      }
    }, config);
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

  private observerCallback(): void {
    // 先關掉防止重複打 API
    this.observer.unobserve(this.anchor.nativeElement);
    if (!this.isFirstLoad && this.currentPage < this.apiPage) {
      this.toggleIsFetching(true);
      this.fetchData();
    }
  }

  private toggleIsFetching(state: boolean): void {
    this.emitToggleIsFetching.emit(state);
  }
}
