import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MultiEditTableModule } from '../../projects/multi-edit-table/src/lib/multi-edit-table.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MultiEditTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
