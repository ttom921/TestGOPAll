import { Component, OnInit, Input, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { PySocketioService } from 'src/app/services/py-socketio.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ImageFileService } from 'src/app/services/image-file.service';

@Component({
  selector: 'app-car-room',
  templateUrl: './car-room.component.html',
  styleUrls: ['./car-room.component.scss'],
  providers: [PySocketioService]
})
export class CarRoomComponent implements OnInit, OnDestroy, AfterViewInit {

  clientclassname = this.constructor.name;
  curnamespace = "";
  @Input() title: string;
  @Input() socketiourl: string;
  isSending: boolean = false;
  //是否要顯示
  @Input() isShowing: boolean;
  @ViewChild("photoImage",{ static: true }) photoImage: ElementRef;
  isLoggedIn$: Observable<boolean>;
  constructor(
    private socketService: PySocketioService,
    private auth: AuthService,
    private imageFileService: ImageFileService
  ) {
    this.isLoggedIn$ = this.auth.isLoggedIn();
    this.isLoggedIn$.subscribe(data => {
      console.log(this.clientclassname + "->" + data);
      if (data == false) {
        this.disconnect();
      }
    });
    //console.log(this.clientclassname + "->" + this.isLoggedIn$);
  }

  ngOnInit() {
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

          this.isSending = !this.isSending ? true:false;
          console.log("isSending->" + this.isSending);
        }
      }
    });

  }

  ngOnDestroy(): void {
    console.log(this.clientclassname + "->ngOnDestroy");
  }
  // 發送圖片
  public Upload(file: HTMLInputElement) {
    if (file.value.length === 0) return;
    //讀所有的圖檔
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

      //開始發射
      let maximgnum = files.length;
      let count = 0;
      setInterval(() => {
        count = (count + 1) % maximgnum;
        this._sendData(count, maximgnum, Bufferary, this.isSending);
      }, 66);

    });
  }
  _sendData(count: number, maximgnum: number, Bufferary: ArrayBuffer, issend: boolean) {
    if (issend === true) {
      this.socketService.Sendbytemessage({ "channel": this.title, "bufdata": Bufferary[count] });
      //console.log(count);
      //
    }
    if (this.isShowing == true) {
      let blob = new Blob([Bufferary[count]], { type: "image/jpeg" });
      let urlCreator = window.URL;
      this.photoImage.nativeElement.src = urlCreator.createObjectURL(blob);
      blob = null;
    }
  }
}
