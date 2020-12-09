import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; //Import the Angular router module and Routes

import {GoogleAnalyticsService} from "./google-analytics.service"; // import our Google Analytics service

import { AppComponent } from './app.component';
import { ComponentOneComponent } from './component-one/component-one.component';
import { ComponentTwoComponent } from './component-two/component-two.component';

export const appRoutes: Routes = [
  {path: '', component: ComponentOneComponent},
  {path: 'component-one', component: ComponentOneComponent},
  {path: 'component-two', component: ComponentTwoComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    ComponentOneComponent,
    ComponentTwoComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [GoogleAnalyticsService], //add it as a provider for events
  bootstrap: [AppComponent]
})
export class AppModule { }
