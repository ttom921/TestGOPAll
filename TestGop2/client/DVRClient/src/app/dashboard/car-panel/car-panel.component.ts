import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-car-panel',
  templateUrl: './car-panel.component.html',
  styleUrls: ['./car-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarPanelComponent implements OnInit {
  channels: string[] = ["channel1", "channel2", "channel3", "channel4", "channel5", "channel6", "channel7", "channel8"];
  //channels: string[] = ["channel1"];
  connecturl = "";
  curnamspace = "car-888";
  constructor() {
    this.connecturl = environment.SERVER_URL + "/" + this.curnamspace;
  }

  ngOnInit() {
  }

}
