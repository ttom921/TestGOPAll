import { Injectable } from '@angular/core';
import * as socketIo from "socket.io-client";
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PySocketioService {
  //目前的namespace
  curnamespace = "";
  private socket: socketIo;
  isConnect$ = new BehaviorSubject<boolean>(false);
  constructor() { }
  //
  InitSocket(ns_url: string) {
    this.socket = socketIo(ns_url, { upgrade: false, transports: ['websocket'] });
  }
  public initIoConnection(nsspace: string): void {
    this.InitSocket(nsspace);
    console.log("initIoConnection->" + nsspace);
    this.Onconnect().subscribe(() => {
      this.curnamespace = this.getNameSpace();
      let fmtmsg = `[client ns:${this.curnamespace} ]connedted`;
      console.log(fmtmsg);
      //通知連線
      this.isConnect$.next(true);
      //this.Sendconnected();
      //要求頻道列表
      //this.SendGetChannellst();

    });
  }

  //斷線
  public disconnect(): void {
    //通知斷線
    this.isConnect$.next(false);
    if (this.socket === undefined) return;
    this.socket.disconnect();
  }
  /**
    *
    * @returns {Observable<T>}
    */
  isConnect(): Observable<boolean> {
    return this.isConnect$.asObservable();
  }
  // 取得此socket連接的namespace
  public getNameSpace(): string {
    return this.socket.nsp;
  }
  //#region 收到socket事件
  public Onconnect(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on("connect", () => { observer.next() })
    });
  }
  public Ondisconnect(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on("disconnect", () => { observer.next() });
    });
  }
  //收到channel的列表
  public OnupdateChannelList(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on("updateChannelList", (data) => { observer.next(data) });
    });
  }

  // public OnjoinNamespace(): Observable<any> {
  //   return new Observable<any>((observer) => {
  //     this.socket.on("joinNamespace", (data) => { observer.next(data) });
  //   });
  // }
  public Onjoin(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on("join", (data) => { observer.next(data) });
    });
  }
  //#endregion
  //#region 傳送訊息給server
  // 向server傳送已連線訊息
  public Sendconnected(data) {
    this.socket.emit("connected", data);
  }
  public SendGetChannellst() {
    this.socket.emit("getchannellst", "取得頻道列表");
  }
  public Sendjoin(data: any) {
    this.socket.emit("join", data);
  }
  //#endregion
  //#region NameSpace相關
  // 加入Namespace
  public joinNameSpace(nsname: string) {
    this.initIoConnection(nsname);
  }
  //#endregion
  //#region bytemessage相關
  public Sendbytemessage(data: any) {
    this.socket.emit("bytemessage", data);
  }
  public Onbytemessage(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on("bytemessage", (data: any) => observer.next(data));
    });
  }
  //#endregion
  //#region chatmessage相關
  public Sendchatmessage(msg: string) {
    this.socket.emit("chatmessage", msg);
  }
  public Onchatmessage(): Observable<string> {
    return new Observable<string>(observable => {
      this.socket.on("chatmessage", (data) => {
        observable.next(data);
      });
    });
  }
  //#endregion
  //#region cmdmessage
  public Sendcmdmessage(data: any) {
    this.socket.emit("cmdmessage", data);
  }
  public Oncmdmessage(): Observable<any> {
    return new Observable<any>(observable => {
      this.socket.on("cmdmessage", (data) => {
        observable.next(data);
      });
    });
  }
  //#endregion
}
