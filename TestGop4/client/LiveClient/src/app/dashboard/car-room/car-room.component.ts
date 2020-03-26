import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { PySocketioService } from 'src/app/services/py-socketio.service';
import { AuthService } from 'src/app/services/auth.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-car-room',
  templateUrl: './car-room.component.html',
  styleUrls: ['./car-room.component.scss'],
  providers: [PySocketioService]
})
export class CarRoomComponent implements OnInit, AfterViewInit {
  clientclassname = this.constructor.name;
  curnamespace = "";
  @Input() title: string;
  @Input() socketiourl: string;
  @Output() ChannleEvent = new EventEmitter<string>(); //提供Output裝飾器，讓該事件成為父親模板的事件

  @ViewChild("photoImage", { static: true }) photoImage: ElementRef;

  isLoggedIn$: Observable<boolean>;
  Subscrlst = new Subscription();
  constructor(
    private socketService: PySocketioService,
    private auth: AuthService) {
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
    //
    this.socketService.Onbytemessage().subscribe(data => {
      let fmtmsg = `${this.clientclassname}->[client ns:${this.curnamespace}]<bytemessage>  data=${data.channel}`;
      //console.log(fmtmsg);

      let buffdata = data.bufdata;
      let blob = new Blob([buffdata], { type: "image/jpeg" });
      let urlCreator = window.URL;
      this.photoImage.nativeElement.src = urlCreator.createObjectURL(blob);

      data.bufdata = null;
    });
    this.socketService.Oncmdmessage().subscribe(data => {
      let fmtmsg = `${this.clientclassname}->[client ns:${this.curnamespace}]<cmdmessage> channel=${this.title} data=${data.params}`;
      console.log(fmtmsg);
    });
  }
  OnChannleEvent() {
    this.ChannleEvent.emit(this.title);
    //console.log("OnChannleEvent");
  }
}
