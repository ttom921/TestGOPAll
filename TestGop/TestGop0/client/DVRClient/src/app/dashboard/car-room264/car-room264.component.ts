import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { H264DataService } from 'src/app/services/h264-data.service';
import { ImageFileService } from 'src/app/services/image-file.service';
import { AuthService } from 'src/app/services/auth.service';
import { PySocketioService } from 'src/app/services/py-socketio.service';
import { Observable, Subscription } from 'rxjs';

//有關264的元件
import JMuxer from 'jmuxer';



//declare var JMuxer: any;
declare var PCMPlayer: any;

@Component({
  selector: 'app-car-room264',
  templateUrl: './car-room264.component.html',
  styleUrls: ['./car-room264.component.scss'],
  providers: [PySocketioService]
})
export class CarRoom264Component implements OnInit, OnDestroy, AfterViewInit {
  clientclassname = this.constructor.name;
  curnamespace = "";
  @Input() title: string;
  @Input() socketiourl: string;
  isSending: boolean = false;
  //是否要顯示
  @Input() isShowing: boolean;
  //#regin H264相關
  jmuxer: any;
  pcmPlayer: any;
  videodataarray = [];
  audiodataarray = [];
  //#endregin H264相關
  isLoggedIn$: Observable<boolean>;
  // 建立空的 Subscription 物件
  sub = new Subscription();
  constructor(
    private socketService: PySocketioService,
    private auth: AuthService,
    private imageFileService: ImageFileService,
    private h264DataService: H264DataService
  ) {
    this.isLoggedIn$ = this.auth.isLoggedIn();
    const obsSub = this.isLoggedIn$.subscribe(data => {
      console.log(this.clientclassname + "->" + data);
      if (data == false) {
        this.disconnect();
      }
    });
    this.sub.add(obsSub);
  }

  ngOnInit() {

    //console.log(this.clientclassname + "->" + this.isLoggedIn$);

  }
  // 斷線
  disconnect() {
    this.socketService.disconnect();
  }
  ngAfterViewInit(): void {
    this.socketService.initIoConnection(this.socketiourl);
    this.socketService.Onconnect().subscribe(() => {
      let res = JSON.parse(localStorage.getItem('currentCar'));
      this.curnamespace = this.socketService.getNameSpace();
      //let fmtmsg = `[client ns:${this.curnamespace} ]connedted`;
      //console.log(fmtmsg);
      //連線時傳送資料給server
      let resdata = {
        type: "DVR",
        namespace: this.curnamespace,
        username: res.username
      }
      this.socketService.Sendconnected(resdata);

      let data = {
        channel: this.title,
        username: res.username
      }
      this.socketService.Sendjoin(data);
    });
    this.socketService.Onjoin().subscribe(data => {
      let fmtmsg = `${this.clientclassname}->[client ns:${this.curnamespace}]<join> data=${data.channel}`;
      console.log(fmtmsg);
      // fmtmsg = `已加人 ${data.channel} 的頻道`;
      // this.snackBar.open(fmtmsg, '我知道了',
      //   {
      //     duration: 2000
      //   });
    });
    this.socketService.Oncmdmessage().subscribe(data => {
      let fmtmsg = `${this.clientclassname}->[client ns:${this.curnamespace}]<cmdmessage> channel=${this.title} data=${data.params}`;
      console.log(fmtmsg);
      if (data.params.dest == this.title) {
        if (data.params.act == "play") {

          this.isSending = !this.isSending ? true : false;
          console.log("isSending->" + this.isSending);
        }
      }
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
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    console.log(this.clientclassname + "->ngOnDestroy");
  }
  //發送影像資料
  public Upload(file: HTMLInputElement) {
    if (file.value.length === 0) return;
    //讀所有的檔案
    const uploadPromises = [];
    const files: FileList = file.files;
    let Bufferary = new ArrayBuffer(files.length);
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      //fmtmsg = element.name;
      //console.log(fmtmsg);
      let uploadPromise = this.imageFileService.GetBufferFromFile(element);
      uploadPromises.push(uploadPromise);
    }
    Promise.all(uploadPromises).then(result => {
      for (let i = 0; i < files.length; i++) {
        Bufferary[i] = result[i];
        //console.log(Bufferary[i]);
      }
      //#region 使用遞回
      let maximgnum = files.length;
      let count = 0;
      this.h264DataService.get264data(count, maximgnum, Bufferary, false, this.jmuxer,/* video_buffer */[], /* audio_buffer */[], /* key_buffer */[], /* i_count */0, /* current_video */[], /* current_audio */[], this.pcmPlayer, this.videodataarray, this.audiodataarray);
      //console.log("data video get end " + this.videodataarray.length);
      //console.log("data audio get end " + this.audiodataarray.length);
      let index = 0;
      setInterval(() => {

        //網路傳送
        if (this.isSending === true) {
          this.socketService.Sendbytemessage({ "channel": this.title, "bufdata": this.videodataarray[index] });
          console.log(`channel:${this.title} ${index}`);
          //
        }
        //是否顯示
        if (this.isShowing == true) {
          this.jmuxer.feed({
            node: 'player',
            video: new Uint8Array(this.videodataarray[index]),
            //audio: new Uint8Array(this.audiodataarray[index])
            //audio: this.audiodataarray[index]
          });
        }

        index = (index + 1) % this.videodataarray.length;
      }, 800);
      //#endregion 使用遞回
    });
  }

}
