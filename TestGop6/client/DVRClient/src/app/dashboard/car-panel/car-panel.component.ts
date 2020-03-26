import { Component, OnInit, ViewChild } from '@angular/core';
import { ImageFileService } from 'src/app/services/image-file.service';
import { MatButton } from '@angular/material/button';
import { CarRoom264Component } from '../car-room264/car-room264.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-car-panel',
  templateUrl: './car-panel.component.html',
  styleUrls: ['./car-panel.component.scss']
})
export class CarPanelComponent implements OnInit {
  clientclassname = this.constructor.name;
  //html元件相關
  @ViewChild("vcbtnstart", { static: false }) vcbtnstart: MatButton;
  @ViewChild("cr264", { static: false }) cr264: CarRoom264Component;
  @ViewChild("spproc", { static: false }) spproc: MatProgressSpinner;
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
  Bufferary: any;
  filelength = 0;
  diameter = 50;
  progressbarValue = 0;
  foldername = "";
  constructor(
    private imageFileService: ImageFileService,
  ) {
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
    console.log("start");

    this.vcbtnstart.disabled = true;
    this.curnamspace = this.selected;
    this.connecturl = `http://${this.selserverip}:${this.serverport}/${this.curnamspace}`;
    //console.log(this.connecturl);
    this.cr264.TestStart(this.selected, this.connecturl);
    if (!this.Bufferary) return;
    let sendtime = 30;
    let index = 0;
    setInterval(() => {
      this.cr264.TestSendData(this.Bufferary[index]);
      index = (index + 1) % this.filelength;
    }, sendtime);
  }
  changeListener($event): void {
    //console.log($event);
    //讀所有的檔案
    this.progressbarValue = 0;
    const uploadPromises = [];
    var files = $event.target.files;
    this.Bufferary = new ArrayBuffer(files.length);
    this.filelength = files.length
    this.getFoldName($event);
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      //fmtmsg = element.name;
      //console.log(fmtmsg);
      let uploadPromise = this.imageFileService.GetBufferFromFile(element);
      uploadPromises.push(uploadPromise);
      this.progressbarValue = Math.round(50 * index / this.filelength);
      //console.log(this.progressbarValue);

    }
    //取到所有的檔案
    Promise.all(uploadPromises).then(result => {
      for (let i = 0; i < files.length; i++) {
        this.Bufferary[i] = result[i];
        //console.log(Bufferary[i]);
        this.progressbarValue = Math.round(100 * (i + 1) / this.filelength);
        //console.log(this.progressbarValue);
      }
      this.vcbtnstart.disabled = false;
    });



    // for (let index = 0; index < files.length; index++) {
    //   const curFile = files[index];
    //   console.log(curFile.webkitRelativePath);
    // }
    // for (var indx in files) {
    //   var curFile = files[indx];
    //   console.log(curFile.webkitRelativePath);
    //   //console.log(curFile.slice(0, curFile.size));
    // }
    //console.log(files);
  }
  getFoldName(e: any) {
    var theFiles = e.target.files;
    var relativePath = theFiles[0].webkitRelativePath;
    var folder = relativePath.split("/");
    //console.log(folder[0]);
    this.foldername = folder[0]
    //return folder[0];
    // alert(folder[0]);
  }
}
