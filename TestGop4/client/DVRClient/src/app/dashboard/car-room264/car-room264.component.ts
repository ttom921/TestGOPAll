import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { H264DataService } from 'src/app/services/h264-data.service';
import { AuthService } from 'src/app/services/auth.service';
import { PySocketioService } from 'src/app/services/py-socketio.service';
import { Observable, Subscription } from 'rxjs';
import { GopFileService } from 'src/app/services/gop-file.service';

//有關264的元件
declare var JMuxer: any;

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
  databufary = [];
  H264obj = {
    i_count: 0,
    flag: false,
    video_buffer: [],
    audio_buffer: [],
    key_buffer: [],
    current_video: [],
    current_audio: [],
  }
  //#endregin H264相關
  isLoggedIn$: Observable<boolean>;
  // 建立空的 Subscription 物件
  sub = new Subscription();
  constructor(
    private socketService: PySocketioService,
    private auth: AuthService,
    private gopFileService: GopFileService,
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
      mode: 'both', /* available values are: both, audio and video */
      debug: false,
      audioType: 'mp3',
      duration: 1000
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
    let filesAmount = file.value.length;
    for (let index = 0; index < filesAmount; index++) {
      const element = files[index];
      //fmtmsg = element.name;
      //console.log(fmtmsg);
      let uploadPromise = this.gopFileService.GetBufferFromFile(element);
      uploadPromises.push(uploadPromise);
    }
    Promise.all(uploadPromises).then(result => {
      for (let i = 0; i < files.length; i++) {
        Bufferary[i] = result[i];
        //console.log(Bufferary[i]);
      }
      //#region 使用遞回

      let index = 0;
      setInterval(() => {

        //網路傳送
        // if (this.isSending === true) {
        //   this.socketService.Sendbytemessage({ "channel": this.title, "bufdata": this.videodataarray[index] });
        //   console.log(`channel:${this.title} ${index}`);
        //   //
        // }
        //是否顯示
        if (this.isShowing == true) {
          this.ShowJMuxer(Bufferary[index]);
        }

        index = (index + 1) % filesAmount;
      }, 800);
      //#endregion 使用遞回
    });
  }
  ShowJMuxer(arybuf) {
    this.databufary.push(arybuf);
    let buffdata = this.databufary.shift();
    //console.log(`this.databufary length=${this.databufary.length}`);
    //console.log(`this.H264obj.i_count=${this.H264obj.i_count}`);
    this.h264DataService.getH264data(buffdata, this.H264obj);

    if (this.H264obj.i_count === 2) {
      //   //console.log(`this.videodataarray length=${this.videodataarray.length}`);
      this.jmuxer.feed({
        node: this.title,
        video: new Uint8Array(this.H264obj.current_video),
        audio: new Uint8Array(this.H264obj.current_audio)
      });
      this.H264obj.i_count = 0;
      this.H264obj.current_video = [];
      this.H264obj.current_audio = [];
    }
  }

}
