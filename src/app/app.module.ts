import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ListComponent } from './usingViewChildren/list/list.component';
import { OverlayComponent } from './common/overlay/overlay.component';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    OverlayComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
