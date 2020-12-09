import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'; // import Router and NavigationEnd

// declare ga as a function to set and sent the events
// declare const ga: Function;
declare let gtag: Function;
// declare let ga: (string, string, string) => void;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
// export class AppComponent {
//   title = 'angularGoogleAnalytics';
// }
export class AppComponent {

  title = 'app';

  constructor(public router: Router) {

    // subscribe to router events and send page views to Google Analytics
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-F5HSFZVLXM', {'page_path' : event.urlAfterRedirects});
        // ga('send', 'pageview');
      }
    });

  }

}
