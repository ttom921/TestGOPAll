import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NsServerService } from 'src/app/service/ns-server.service';

export interface CarChElement {
  chname: string;
  sid: string;
}

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

  //data table 相關
  ELEMENT_DATA: CarChElement[] = [
    // { chname: 'ch01', sid: "aaabbbccc" },
    // { chname: 'ch01', sid: "aaabbbccc" },
    // { chname: 'ch01', sid: "aaabbbccc" },
    // { chname: 'ch01', sid: "aaabbbccc" },
    // { chname: 'ch01', sid: "aaabbbccc" },
    // { chname: 'ch01', sid: "aaabbbccc" },
    // { chname: 'ch01', sid: "aaabbbccc" },
  ];
  displayedColumns: string[] = ['chname', 'sid', 'action'];
  dataSource = new MatTableDataSource<CarChElement>();
  constructor(private nsServerService: NsServerService) {
    this.testGenServerIP();
  }

  ngOnInit() {
    this.wsurl = `${this.selectedip}:${this.serverport}`;
    this.nsServerService.getCars(this.wsurl).subscribe((value) => {
      //console.log(value.data);
      this.cars = value.data;
    });
  }
  btnClick(item) {
    this.nsServerService.putDVRDisconnect(this.wsurl, item.sid).subscribe((value) => {
      console.log(value);
    });
  }
  testGenServerIP() {
    this.serverips.push("172.18.2.10");
    this.serverips.push("172.18.2.44");
    //this.serverips.push("172.18.2.28");//jack
  }
  getChannellist() {
    this.nsServerService.getCarChannellistDetail(this.wsurl, this.selectedcar).subscribe((value) => {
      console.log(value.data);
      value.data.forEach(element => {
        let item = {
          chname: element.channel,
          sid: element.sid
        };
        //console.log(item);
        this.ELEMENT_DATA.push(item);
      });
      this.dataSource = new MatTableDataSource<CarChElement>(this.ELEMENT_DATA)
      //this.dataSource = this.ELEMENT_DATA;
    });
  }
}
