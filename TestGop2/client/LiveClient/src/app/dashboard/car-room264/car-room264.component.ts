import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { PySocketioService } from 'src/app/services/py-socketio.service';
import { Subscription } from 'rxjs';

//有關264的元件
import JMuxer from 'jmuxer';
import { H264DataService } from 'src/app/services/h264-data.service';

@Component({
  selector: 'app-car-room264',
  templateUrl: './car-room264.component.html',
  styleUrls: ['./car-room264.component.scss'],
  providers: [PySocketioService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarRoom264Component implements OnInit, OnDestroy, AfterViewInit {
  clientclassname = this.constructor.name;
  curnamespace = "";
  @Input() title: string;
  @Input() socketiourl: string;

  //#regin H264相關
  //i_count = { value: 1 };
  jmuxer: any;
  databufary = [];
  H264obj = {
    i_count: 0,
    video_buffer: [],
    audio_buffer: [],
    key_buffer: [],
    current_video: [],
    current_audio: [],
  }
  //#endregin H264相關

  // 建立空的 Subscription 物件
  sub = new Subscription();

  constructor(
    private socketService: PySocketioService,
    private h264DataService: H264DataService
  ) { }
  disconnect() {
    this.socketService.disconnect();
  }
  ngOnInit() {
  }
  ngAfterViewInit(): void {
    this.socketService.initIoConnection(this.socketiourl);
    this.socketService.Onconnect().subscribe(() => {
      this.curnamespace = this.socketService.getNameSpace();

      let data = {
        channel: this.title,
        username: "ttom"
      }
      this.socketService.Sendjoin(data);
    });
    this.socketService.Onbytemessage().subscribe(data => {
      // let fmtmsg = `${this.clientclassname}->[client ns:${this.curnamespace}]<bytemessage>  data=${data.channel}`;
      // console.log(fmtmsg);

      //console.log(`before i_count=${this.H264obj.i_count}`);
      //let buffdata = data.bufdata;
      this.databufary.push(data.bufdata);
      let buffdata = this.databufary.shift();
      // console.log(`this.databufar length=${this.databufar.length}`);
      this.h264DataService.getH264data(buffdata, this.H264obj);
      if (this.H264obj.i_count === 2) {
        //   //console.log(`this.videodataarray length=${this.videodataarray.length}`);
        this.jmuxer.feed({
          node: this.title,
          video: new Uint8Array(this.H264obj.current_video),
          //audio: new Uint8Array(this.audiodataarray[index])
          //audio: this.audiodataarray[index]
        });
        this.H264obj.i_count = 0;
        this.H264obj.current_video = [];
        this.H264obj.current_audio = [];
      }

      // data.bufdata = null;
    });
    //初始化畫面元件
    this.jmuxer = new JMuxer({
      node: this.title,
      mode: 'video', /* available values are: both, audio and video */
      debug: true,
      duration: 1000
    });

  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    console.log(this.clientclassname + "->ngOnDestroy");

  }

}
