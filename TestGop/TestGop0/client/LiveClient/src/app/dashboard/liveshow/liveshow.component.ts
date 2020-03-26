import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CarnamespaceService } from 'src/app/services/carnamespace.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { PySocketioService } from 'src/app/services/py-socketio.service';
import { environment } from 'src/environments/environment';
import { Subscription, Observable } from 'rxjs';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-liveshow',
  templateUrl: './liveshow.component.html',
  styleUrls: ['./liveshow.component.scss']
})
export class LiveshowComponent implements OnInit, AfterViewInit, OnDestroy {

  clientclassname = this.constructor.name;
  curnamespace = "";
  connecturl = "";
  // 車牌列表
  carnamespacelst: string[] = [];
  channels: string[] = [];
  selected = "";
  channle = "";
  cmdmsg = { "arg1": "play", "arg2": "for", "arg3": "Geeks" };

  isConnect$: Observable<boolean>;
  Subscrlst = new Subscription();
  constructor(
    private carnssrv: CarnamespaceService,
    private toasterService: ToasterService,
    private socketService: PySocketioService
  ) {
    this.isConnect$ = this.socketService.isConnect();

    //通知有連到特定的namespace
    const obsSub = this.isConnect$.subscribe(data => {
      //console.log(data);
      if (data == true) {
        this.curnamespace = this.socketService.getNameSpace();
        //連線時傳送資料給server
        let res = JSON.parse(localStorage.getItem('currentUser'));
        let data = {
          type: "LIVE",
          namespace: this.curnamespace,
          username: res.username
        }
        this.socketService.Sendconnected(data);
        //

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
      }
    });
    this.Subscrlst.add(obsSub);
  }

  ngOnInit() {
  }
  // 斷線
  disconnect() {
    this.socketService.disconnect();
  }
  ngOnDestroy(): void {
    this.Subscrlst.unsubscribe();
    this.disconnect();
    console.log(this.clientclassname + "->ngOnDestroy");
  }
  ngAfterViewInit(): void {

  }
  // 取得車牌
  public GetCarNameSpace() {
    try {
      this.carnssrv.getNamespace().subscribe(
        data => {
          //this.router.navigate(['/']);
          //console.log("GetCarNameSpace=>subscribe");
          //console.log(data);
          this.carnamespacelst.push(data.data);
        },
        error => {
          //console.log(error);
          this.toasterService.showToaster(error.statusText);
          //this.toasterService.showToaster(error.error.message);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  // 加人namespace
  public joinNameSpace(ns: string) {
    this.connecturl = environment.SERVER_URL + "/" + ns;
    this.socketService.joinNameSpace(this.connecturl);
  }
  // 加入控制頻道
  public JoinControlChannle() {
    let res = JSON.parse(localStorage.getItem('currentUser'));
    let data = {
      channel: "channel0",
      username: res.username
    }
    this.socketService.Sendjoin(data);
  }
  OnChannelEvent($event) {
    //console.log($event);
    let myparam = {
      dest: $event,
      act: "play"
    }
    let data = {
      cmd: "cmdmsg",
      channel: $event,
      params: myparam
    }
    this.socketService.Sendcmdmessage(data);
  }
  SendCmdMessage() {
    let myparam = {
      dest: this.channle,
      act: "play"
    }
    let data = {
      cmd: "cmdmsg",
      params: myparam
    }
    this.socketService.Sendcmdmessage(data);
  }
}
