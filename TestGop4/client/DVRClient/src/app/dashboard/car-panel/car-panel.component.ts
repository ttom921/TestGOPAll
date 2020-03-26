import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Car } from 'src/app/models/car';
import { ToasterService } from 'src/app/services/toaster.service';
import { PySocketioService } from 'src/app/services/py-socketio.service';
import { environment } from 'src/environments/environment';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-car-panel',
  templateUrl: './car-panel.component.html',
  styleUrls: ['./car-panel.component.scss']
})
export class CarPanelComponent implements OnInit, OnDestroy {

  clientclassname = this.constructor.name;
  curnamespace = "";
  connecturl = "";
  channels: string[] = [];
  currCar: Car = new Car();
  isConnect$: Observable<boolean>;
  isLoggedIn$: Observable<boolean>;
  isConnectSubscp: Subscription;
  constructor(
    private auth: AuthService,
    private toasterService: ToasterService,
    private socketService: PySocketioService
  ) {
    // //登入相關
    this.isLoggedIn$ = this.auth.isLoggedIn();
    // this.isLoggedIn$.subscribe(data => {
    //   console.log(this.clientclassname + "-isLoggedIn->" + data);
    //   if (data == false) {
    //     this.disconnect();
    //   }
    // });
    //連線相關
    this.isConnect$ = this.socketService.isConnect();
    this.isConnectSubscp = this.isConnect$.subscribe(data => {
      console.log(this.clientclassname + "-isConnect>" + data);
      if (data == true) {
        this.curnamespace = this.socketService.getNameSpace();
        let res = JSON.parse(localStorage.getItem('currentCar'));
        //連線時傳送資料給server
        let resdata = {
          type: "DVR",
          namespace: this.curnamespace,
          username: res.username
        }
        this.socketService.Sendconnected(resdata);
        //收到channel列表
        this.socketService.OnupdateChannelList().subscribe(data => {
          let fmtmsg = `${this.clientclassname}->[client ns:${this.curnamespace}]<updateChannelList> ChannelList=${data.result}`;
          console.log(fmtmsg);
          this.channels = data.result;
        });
        //要求頻道列表
        
        this.socketService.SendGetChannellst();
        //加入控制頻道
        this.JoinControlChannle();
        this.socketService.Onjoin().subscribe(data => {
          let fmtmsg = `${this.clientclassname}->[client ns:${this.curnamespace}]<join> data=${data.channel}`;
          console.log(fmtmsg);
          // fmtmsg = `已加人 ${data.channel} 的頻道`;
          // this.snackBar.open(fmtmsg, '我知道了',
          //   {
          //     duration: 2000
          //   });
        });

      }//if
    });
  }

  ngOnInit() {
    let res = JSON.parse(localStorage.getItem('currentCar'));
    if (res === null) {
      this.currCar.username = null;
    } else {
      this.currCar = res;
    }

  }
  // 斷線
  disconnect() {
    this.socketService.disconnect();
  }
  ngOnDestroy(): void {
    this.isConnectSubscp.unsubscribe();
    this.disconnect();
    console.log(this.clientclassname + "->ngOnDestroy");
  }
  joinNameSpace(ns: string) {
    this.connecturl = environment.SERVER_URL + "/" + ns;
    this.socketService.joinNameSpace(this.connecturl);
  }
  // 加入控制頻道
  public JoinControlChannle() {
    let res = JSON.parse(localStorage.getItem('currentCar'));
    let data = {
      channel: "channel0",
      username: res.username
    }
    this.socketService.Sendjoin(data);
  }
}
