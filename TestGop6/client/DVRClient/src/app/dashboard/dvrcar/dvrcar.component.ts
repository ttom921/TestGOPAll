import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { PySocketioService } from 'src/app/services/py-socketio.service';
import { Title } from '@angular/platform-browser';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ImageFileService } from 'src/app/services/image-file.service';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-dvrcar',
  templateUrl: './dvrcar.component.html',
  styleUrls: ['./dvrcar.component.scss'],
  providers: [PySocketioService]
})


export class DVRcarComponent implements OnInit {
  clientclassname = this.constructor.name;
  //html元件相關
  @ViewChild("vcbtnstart", { static: false }) vcbtnstart: MatButton;
  @ViewChild("spproc", { static: false }) spproc: MatProgressSpinner;
  curnamespace = "";

  @Input() title: string;
  @Input() carname: string;
  @Input() serverip: string;
  @Input() serverport: string;
  connecturl: string;

  Bufferary: any;
  filelength = 0;
  diameter = 50;
  progressbarValue = 0;
  foldername = "";
  constructor(
    private imageFileService: ImageFileService,
    private socketService: PySocketioService,
    private titleService: Title,
  ) { }

  ngOnInit() {
  }
  disconnect() {
    this.socketService.disconnect();
  }
  JoinChannel() {
    let data = {
      channel: this.title,
      username: "ttom"
    }
    this.socketService.Sendjoin(data);
  }
  start() {

    this.vcbtnstart.disabled = true;
    this.curnamespace = this.carname;
    this.connecturl = `http://${this.serverip}:${this.serverport}/${this.curnamespace}`;
    console.log(this.connecturl);

    this.socketService.initIoConnection(this.connecturl);
    this.socketService.Onconnect().subscribe(() => {

      this.curnamespace = this.socketService.getNameSpace();
      this.JoinChannel();
      let newTitle = `${this.curnamespace}/${this.title}`;
      this.titleService.setTitle(newTitle);

    },
      (err) => { console.log('error: ' + err) }
    );

    // this.socketService.Onbytemessage().subscribe(data => {
    //   let fmtmsg = `${this.clientclassname}->[client ns:${this.curnamespace}]<bytemessage>  data=${data.channel}`;
    //   console.log(fmtmsg);
    //   data.bufdata = null;
    // });

    if (!this.Bufferary) return;
    let sendtime = 32;
    let index = 0;
    this._interval(() => {
      this.TestSendData(this.Bufferary[index]);
      index = (index + 1) % this.filelength;
    }, sendtime);
    // setInterval(() => {
    //   this.TestSendData(this.Bufferary[index]);
    //   index = (index + 1) % this.filelength;
    // }, sendtime);
  }

  TestSendData(bufdata) {
    this.socketService.Sendbytemessage({ "channel": this.title, "bufdata": bufdata });
    //console.log(`${this.curnamespace}=>channel:${this.title}`);
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

  _interval(func, wait) {
    var interv = function () {
      func.call(null);
      setTimeout(interv, wait);
    }
    setTimeout(interv, wait);
  }
}
