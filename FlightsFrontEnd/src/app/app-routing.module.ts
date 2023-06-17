import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { FlightFormComponent } from './flight-form/flight-form.component';
import { FlightService } from './flight.service';

const routes: Routes = [
  { path: '', component: FlightFormComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    FlightFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)  
  ],
  providers: [FlightService],
  bootstrap: [AppComponent]
})
export class AppModule { }
