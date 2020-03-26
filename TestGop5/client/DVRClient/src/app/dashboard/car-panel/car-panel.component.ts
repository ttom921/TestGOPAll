import { Component, OnInit } from '@angular/core';
import { GetCarListService } from 'src/app/service/get-car-list.service';
import { CarRoomComponent } from '../car-room/car-room.component';
import { PySocketioService } from 'src/app/service/py-socketio.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-car-panel',
  templateUrl: './car-panel.component.html',
  styleUrls: ['./car-panel.component.scss']
})
export class CarPanelComponent implements OnInit {
  clientclassname = this.constructor.name;
  //服務器相關
  serverips: string[] = [];
  selectedip = "172.18.2.10";
  serverport = "50001";
  //車子相關
  cars: string[] = [];
  selectedcar = 'car-00';
  //頻道相關
  wsurl: string = "";
  channels: string[] = ["channel0", "channel1", "channel2", "channel3", "channel4", "channel5", "channel6", "channel7", "channel8"];
  carRooms: CarRoomComponent[] = [];
  constructor(private getCarListService: GetCarListService) {
    this.testGenServerIP();
  }

  ngOnInit() {
    this.wsurl = `${this.selectedip}:${this.serverport}`;
    this.getCarListService.getCars(this.wsurl).subscribe((value) => {
      //console.log(value.data);
      this.cars = value.data;
    });
  }
  startwork() {
    this.channels.forEach(element => {
      let item = new CarRoomComponent(new PySocketioService());
      item.title = element;
      item.socketiourl = `${this.wsurl}/${this.selectedcar}`;
      this.carRooms.push(item);
    });
    this.carRooms.forEach(element => {
      element.StartConnect(this.selectedcar, this.wsurl);
    });



  }
  testGenServerIP() {
    this.serverips.push("172.18.2.10");
    this.serverips.push("172.18.2.44");
    //this.serverips.push("172.18.2.28");//jack
  }
}
