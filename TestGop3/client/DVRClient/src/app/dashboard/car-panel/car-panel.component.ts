import { Component, OnInit, ChangeDetectionStrategy, ViewChildren, QueryList, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CarRoom264Component } from '../car-room264/car-room264.component';
import { ImageFileService } from 'src/app/services/image-file.service';
import { MatButton } from '@angular/material/button';
import { Subscription, Observable } from 'rxjs';
import { Room264StateService } from 'src/app/services/room264-state.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-car-panel',
  templateUrl: './car-panel.component.html',
  styleUrls: ['./car-panel.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarPanelComponent implements OnInit, AfterViewInit, OnDestroy {

  clientclassname = this.constructor.name;

  serverips: string[] = [];
  selserverip = "172.18.2.57";
  serverport = "50001";

  cars: string[] = [];
  selected = 'car-00';
  selectedchannel = "channel1";
  channels: string[] = ["channel1", "channel2", "channel3", "channel4", "channel5", "channel6", "channel7", "channel8"];
  connectitems: string[] = [];
  connecturl = "";
  curnamspace = "car-888";
  Bufferary: any;
  @ViewChild("vcbtnsend", { static: false }) vcbtnsend: MatButton;
  @ViewChild("vcbtnstart", { static: false }) vcbtnstart: MatButton;
  @ViewChild("cr264", { static: false }) cr264: CarRoom264Component;
  //@ViewChildren('cr264') components: QueryList<CarRoom264Component>;
  constructor(
    private imageFileService: ImageFileService,
  ) {

    this.testGenServerIP();
    this.testGenCarNum();


  }
  testGenServerIP() {
    this.serverips.push("172.18.2.57");
    this.serverips.push("172.18.2.28");//jack
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
  ngAfterViewInit() {
    // print array of CustomComponent objects
    // this.components.forEach((item) => {
    //   console.log(item);
    // });

  }
  ngOnDestroy(): void {
    console.log(this.clientclassname + "->ngOnDestroy");
  }
  start() {
    this.vcbtnstart.disabled = true;
    this.curnamspace = this.selected;
    this.connecturl = `http://${this.selserverip}:${this.serverport}/${this.curnamspace}`;
    //console.log(this.connecturl);
    this.cr264.TestStart(this.selected, this.connecturl);

    if (!this.Bufferary) return;
    // setInterval(() => {
    //   this.cr264.TestSendData(this.Bufferary[0]);
    // }, 30);

    setInterval(() => {
      this.cr264.TestSendData(this.Bufferary[0]);
    }, 60);

  }

  public Upload(file: HTMLInputElement) {
    if (file.value.length === 0) return;
    //讀所有的檔案
    const uploadPromises = [];
    const files: FileList = file.files;
    this.Bufferary = new ArrayBuffer(files.length);
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      //fmtmsg = element.name;
      //console.log(fmtmsg);
      let uploadPromise = this.imageFileService.GetBufferFromFile(element);
      uploadPromises.push(uploadPromise);
    }
    Promise.all(uploadPromises).then(result => {
      for (let i = 0; i < files.length; i++) {
        this.Bufferary[i] = result[i];
        //console.log(Bufferary[i]);
      }
    });
    this.vcbtnstart.disabled = false;
  }


}
