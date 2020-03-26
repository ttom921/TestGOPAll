import { Component, OnInit, ChangeDetectionStrategy, Input, AfterViewInit, ViewChild } from '@angular/core';
import { PySocketioService } from 'src/app/services/py-socketio.service';
import { Title } from '@angular/platform-browser';

// import { HiPlayer } from "./assets/js/hi-player.js";
//有關264的元件
declare var HiPlayer: any;
declare var msgpack: any;

@Component({
  selector: 'app-car-room264',
  templateUrl: './car-room264.component.html',
  styleUrls: ['./car-room264.component.scss'],
  providers: [PySocketioService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarRoom264Component implements OnInit, AfterViewInit {

  clientclassname = this.constructor.name;
  curnamespace = "";
  car = "";
  @Input() title: string;
  @Input() socketiourl: string;
  @Input() carname: string;

  hiPlayer: any;
  databufary = [];
  isChecked = false;
  constructor(
    private socketService: PySocketioService,
    private titleService: Title,
  ) { }
  disconnect() {
    this.socketService.disconnect();
  }
  ngOnInit() {

  }
  ngAfterViewInit(): void {
    this.hiPlayer = new HiPlayer({
      node: "v" + this.title,
      mode: 'both', /* available values are: both, audio and video */
      debug: true,
      audioType: 'mp3'
      // duration: 33
    });
  }
  JoinChannel() {
    let data = {
      channel: this.title,
      username: "ttom"
    }
    this.socketService.Sendjoin(data);
  }
  TestStart(carname: string, conurl: string) {
    this.car = carname;
    this.socketiourl = conurl;
    console.log(this.socketiourl);

    this.socketService.initIoConnection(this.socketiourl);
    this.socketService.Onconnect().subscribe(() => {

      this.curnamespace = this.socketService.getNameSpace();
      this.JoinChannel();
      let newTitle = `${this.curnamespace}/${this.title}`;
      this.titleService.setTitle(newTitle);

    },
      (err) => { console.log('error: ' + err) });

    this.socketService.Onbytemessage().subscribe(data => {
      let fmtmsg = `${this.clientclassname}->[client ns:${this.curnamespace}]<bytemessage>  data=${data.channel}`;
      //console.log(fmtmsg);
      if (this.isChecked) {
        this.databufary.push(data.bufdata);
        let buffdata = this.databufary.shift();
        let gopData = msgpack.decode(new Uint8Array(buffdata));
        this.hiPlayer.feed(gopData);
      }

      data.bufdata = null;


    });
  }
  start() {
    console.log("start");
    console.log(this.socketiourl);
    console.log(this.carname);
    this.TestStart(this.carname, this.socketiourl);
  }
}
