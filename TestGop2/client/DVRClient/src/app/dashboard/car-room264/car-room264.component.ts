import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { PySocketioService } from 'src/app/services/py-socketio.service';
import { Subscription } from 'rxjs';
import { GopFileService } from 'src/app/services/gop-file.service';

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
  isSending: boolean = false;
  //#regin H264相關
  //jmuxer: any;
  //pcmPlayer: any;
  //videodataarray = [];
  //audiodataarray = [];
  //#endregin H264相關

  // 建立空的 Subscription 物件
  sub = new Subscription();

  constructor(
    private socketService: PySocketioService,
    private gopFileService: GopFileService
  ) { }

  ngOnInit() {

  }
  disconnect() {
    this.socketService.disconnect();
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
      let uploadPromise = this.gopFileService.GetBufferFromFile(element);
      uploadPromises.push(uploadPromise);
    }
    Promise.all(uploadPromises).then(result => {
      for (let i = 0; i < files.length; i++) {
        Bufferary[i] = result[i];
        //console.log(Bufferary[i]);
      }
      let index = 0;
      setInterval(() => {
        //網路傳送
        this.socketService.Sendbytemessage({ "channel": this.title, "bufdata": Bufferary[index] });
        console.log(`channel:${this.title} ${index}`);

        index = (index + 1) % files.length;
      }, 800);

    });



  }
}
