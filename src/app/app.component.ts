import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'practice-infinite-scroll-angular';
  isFetchData: boolean = true;

  toggledIsFetching(state: boolean): void {
    this.isFetchData = state;
  }
}
