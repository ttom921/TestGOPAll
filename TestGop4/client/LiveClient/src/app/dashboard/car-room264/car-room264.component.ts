import { Component, OnInit, Input, EventEmitter, Output, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { PySocketioService } from 'src/app/services/py-socketio.service';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
//有關264的元件
import JMuxer from 'jmuxer';
declare var PCMPlayer: any;

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
  @Input() title: string;
  @Input() socketiourl: string;
  @Output() ChannleEvent = new EventEmitter<string>(); //提供Output裝飾器，讓該事件成為父親模板的事件
  isLoggedIn$: Observable<boolean>;
  Subscrlst = new Subscription();

  //#regin H264相關
  jmuxer: any;
  pcmPlayer: any;
  videodataarray = [];
  audiodataarray = [];
  //#endregin H264相關

  constructor(
    private socketService: PySocketioService,
    private auth: AuthService
  ) {
    this.isLoggedIn$ = this.auth.isLoggedIn();
    const obsSub = this.isLoggedIn$.subscribe(data => {
      console.log(this.clientclassname + "->" + data);
      if (data == false) {
        this.disconnect();
      }
    });
    this.Subscrlst.add(obsSub);
  }

  ngOnInit() {
  }
  ngOnDestroy(): void {
    this.Subscrlst.unsubscribe();
    console.log(this.clientclassname + "->ngOnDestroy");
  }
  // 斷線
  disconnect() {
    this.socketService.disconnect();
  }

  ngAfterViewInit(): void {
    this.socketService.initIoConnection(this.socketiourl);
    this.socketService.Onconnect().subscribe(() => {
      this.curnamespace = this.socketService.getNameSpace();
      let res = JSON.parse(localStorage.getItem('currentUser'));
      //let fmtmsg = `[client ns:${this.curnamespace} ]connedted`;
      //console.log(fmtmsg);
      //連線時傳送資料給server
      let resdata = {
        type: "LIVE",
        namespace: this.curnamespace,
        username: res.username
      }
      this.socketService.Sendconnected(resdata);
      //
      let data = {
        channel: this.title,
        username: res.username
      }
      this.socketService.Sendjoin(data);
    });
    //this.curnamespace = this.socketService.getNameSpace();
    this.socketService.Onjoin().subscribe(data => {
      let fmtmsg = `${this.clientclassname}->[client ns:${this.curnamespace}]<join> data=${data.channel}`;
      console.log(fmtmsg);
      // fmtmsg = `已加人 ${data.channel} 的頻道`;
      // this.snackBar.open(fmtmsg, '我知道了',
      //   {
      //     duration: 2000
      //   });
    });
    this.socketService.Onbytemessage().subscribe(data => {
      let fmtmsg = `${this.clientclassname}->[client ns:${this.curnamespace}]<bytemessage>  data=${data.channel}`;
      console.log(fmtmsg);

      let buffdata = data.bufdata;
      // let blob = new Blob([buffdata], { type: "image/jpeg" });
      // let urlCreator = window.URL;
      // this.photoImage.nativeElement.src = urlCreator.createObjectURL(blob);
      this.jmuxer.feed({
        node: this.title,
        video: new Uint8Array(buffdata),
        //audio: new Uint8Array(this.audiodataarray[index])
        //audio: this.audiodataarray[index]
      });

      data.bufdata = null;
    });
    this.socketService.Oncmdmessage().subscribe(data => {
      let fmtmsg = `${this.clientclassname}->[client ns:${this.curnamespace}]<cmdmessage> channel=${this.title} data=${data.params}`;
      console.log(fmtmsg);
    });
    //初始化畫面元件
    this.jmuxer = new JMuxer({
      node: this.title,
      mode: 'video', /* available values are: both, audio and video */
      debug: false,
      duration: 1000
    });
    this.pcmPlayer = new PCMPlayer({
      encoding: '16bitInt',
      channels: 1,
      sampleRate: 8000,
      flushingTime: 0
    });
  }
  OnChannleEvent() {
    this.ChannleEvent.emit(this.title);
    //console.log("OnChannleEvent");
  }

}
