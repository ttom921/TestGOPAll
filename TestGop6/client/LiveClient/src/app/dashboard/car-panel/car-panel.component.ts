import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { CarRoom264Component } from '../car-room264/car-room264.component';

@Component({
  selector: 'app-car-panel',
  templateUrl: './car-panel.component.html',
  styleUrls: ['./car-panel.component.scss']
})
export class CarPanelComponent implements OnInit, AfterViewInit {

  clientclassname = this.constructor.name;
  //html元件相關
  @ViewChild("vcbtnstart", { static: false }) vcbtnstart: MatButton;
  //@ViewChild("documentSection", { static: false }) documentSection: ElementRef;
  //服務器相關
  serverips: string[] = [];
  selserverip = "172.18.2.57";
  //serverport = "50001";
  serverport = "80";
  //車子相關
  cars: string[] = [];
  selected = 'car-00';
  connecturl = "";
  curnamspace = "car-888";
  selectedchannel = "channel1";
  channels: string[] = ["channel1", "channel2", "channel3", "channel4", "channel5", "channel6", "channel7", "channel8"];
  constructor() {
    this.testGenServerIP();
    this.testGenCarNum();
  }

  testGenServerIP() {
    this.serverips.push("172.18.2.57");
    this.serverips.push("ttom.tplinkdns.com");
    this.serverips.push("172.18.2.188");//jack
    this.serverips.push("172.18.2.20");
  }
  testGenCarNum() {
    const carnum = 20;
    for (let index = 0; index < carnum; index++) {
      let fmt = `car-${index < 10 ? "0" + index : index}`;
      this.cars.push(fmt);
    }

  }

  ngOnInit() {
  }
  start() {
    //console.log("start");
    this.vcbtnstart.disabled = true;
    this.curnamspace = this.selected;
    this.connecturl = `http://${this.selserverip}:${this.serverport}/${this.curnamspace}`;
    console.log(this.connecturl);
    //this.cr264.TestStart(this.selected, this.connecturl);
  }
  ngAfterViewInit(): void {
    //let divWidth = this.documentSection.nativeElement.offsetWidth;
    //console.log("divWidth=" + divWidth);
  }
}
