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
