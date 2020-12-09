# Google Analytics Logging

[github.com/CDECatapult/integrating-google-analytics-w-angular](https://github.com/CDECatapult/integrating-google-analytics-w-angular)

In order to add the ability to log every single action done by the user we will use Google Analytics. Unfortuantely it isn't enought to just add the google pixel script to the header part of the html section of the project. Because Angular creates a one-page application, it is not possible to track users beyond the index page without making huge changes to the angular code. This document will provide and example of such changes.

---

## Google Analytics Logging - Configure Google Account

To configure Google Analytics, just create an acccount [https://analytics.google.com/](https://analytics.google.com/) and go to:

**Admin** > **Account** (**Diy** or similar) > **Property** (**Diy4uAnalytics** or similar)

From here select **Data Streams**. After that hit **Add stream** (Web type of stream, of course).

![img1](https://i.imgur.com/gU28ImU.png)

From here write down your "G-" tracking code and copy the gtag script. To see in detail how to find your traking code read this [Analytics Help](https://analyticshelp.io/blog/google-analytics-property-tracking-id/) article.

Example of script:

```js
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-F5HSFZVLXM"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-F5HSFZVLXM');
</script>
```

---

## Google Analytics Logging - Tracking Router Events

Every Angular developer, builds Single-Page Applications because of how Angular is designed. This means the entire web app runs within one page which makes it hard to monitor user activity. In this case the Angular resources are dynamically loaded on the client side and this results in incorrect data being sent to our site tracker.

The only fix is to emit an event every time the user navigates trough the application. This is possible by using the `Router.event` to provide us with an observable that we can subscribe to and receive information like the page url and send that info to Google Analitics.

Assuming you have a simple vanilla application done with:

```bash
ng new angularGoogleAnalytics
```

Add two components with:

```bah
ng g component ComponentOne
ng g component ComponentTwo
```

The assumption is you already have an `app.module.ts` with routes in it.

Example of routes:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; //Imported the routes

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

And of course we are making the assumption that you already have `<router-outlet></router-outlet>
` in `app.component.html`.

We can no add the main piece of code. We can do this by editing index.html and adding at the beginning of the head tag the follwing:

```html
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-F5HSFZVLXM"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-F5HSFZVLXM');
</script>
```

In order to manually send our page views to Google, we need change the router.events property to trigger a page view when we move from one route to another.

Therefore from your normal code:

```typescript
import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'; // import Router and NavigationEnd
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angularGoogleAnalytics';
}
```

Change it to:

```typescript
import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'; // import Router and NavigationEnd

// declare ga as a function to set and sent the events
declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = 'app';

  constructor(public router: Router) {

    // subscribe to router events and send page views to Google Analytics
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-F5HSFZVLXM', {'page_path' : event.urlAfterRedirects});
      }
    });

  }

}
```

Make sure you have some buttons in the code so that you can click them with:

```html
<button type="button" routerLink="/component-one">GoToCompOne</button>
```

and:

```html
<button type="button" routerLink="/component-two">GoToCompTwo</button>
```

You should now be able to see different page views in Google Analytics **REAL-TIME** view.

![RealTime](https://i.imgur.com/spopeFr.png)

---

## Google Analytics Logging - Track Events

We may want to do more than just track a user page visit. Other actions can include things like products being added to the basket or things being liked. Let's say we have something simple like a button inside the first component. We need to create a service with and event emitter that takes in `eventCategory`, `eventAction`, `eventLabel` as well as `eventLabel` and submits all of them to Google. All those elements are described in the [Google Analitics Event](https://developers.google.com/analytics/devguides/collection/analyticsjs/events) page.

Create a file in the main applicatoin folder called `google-analytics.service.ts`. The file needs to look like the follwing:

```typescript
import { Injectable } from '@angular/core';

declare let gtag:Function;

@Injectable()
export class GoogleAnalyticsService {
  constructor() { }
  public eventEmitter(eventName: string, eventCategory: string,
                      eventAction: string, eventLabel: string = null,
                      eventValue: number = null) {
    gtag('event', eventName, {
      eventCategory: eventCategory,
      eventLabel: eventLabel,
      eventAction: eventAction,
      eventValue: eventValue
    });
  }
}
```

We then import our service to the `app.module.ts` file and add it as a provider, therefore it should look like this:

```typescript
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
```

Add a simple like button in, let's say ComponentOne that looks like (in `component-one.component.html`): `<button type="button" class="btn btn-primary btn-lg center" (click)="SendLikeEvent()">Like</button>`

Finally the typescript part of that component (that is`component-one.component.ts`) needs to be changed and made to look like:

```typescript
import { Component, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from "../google-analytics.service"; // import our analytics service

@Component({
  selector: 'app-component-one',
  templateUrl: './component-one.component.html',
  styleUrls: ['./component-one.component.css']
})
export class ComponentOneComponent implements OnInit {

  constructor(public googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() { }

  SendLikeEvent() {
    // We call the event emmiter function from our service and pass in the details
    this.googleAnalyticsService.eventEmitter("userPage", "like", "userLabel", "1");
  }

}
```

In conclusion, for every component that needs to be tracked, one much chang the `component-xyz.component.html` file AND the `component-xyz.component.ts` file accordingly. For this reason the development of the platform should take this in consideration to avoid **technical debt**.

![event](https://i.imgur.com/D4Er3RE.png)

---

## How To Run And Build

**Run**

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

**Build**

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

---
