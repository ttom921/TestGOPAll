import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { PySocketioService } from 'src/app/service/py-socketio.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-car-room',
  templateUrl: './car-room.component.html',
  styleUrls: ['./car-room.component.scss']
})
export class CarRoomComponent implements OnInit, OnDestroy, AfterViewInit {

  clientclassname = this.constructor.name;
  curnamespace = "";
  car = "";
  @Input() title: string;
  @Input() socketiourl: string;
  constructor(
    private socketService: PySocketioService,
    //private titleService: Title,
  ) { }

  ngOnInit() {
  }
  ngAfterViewInit(): void {
  }
  ngOnDestroy(): void {
    console.log(this.clientclassname + "->ngOnDestroy");
  }
  disconnect() {
    this.socketService.disconnect();
  }

  JoinChannel() {
    let data = {
      channel: this.title,
      username: "ttom"
    }
    this.socketService.Sendjoin(data);
  }
  StartConnect(carname: string, conurl: string) {
    this.car = carname;
    this.socketiourl = `${conurl}/${carname}`;;
    console.log(this.socketiourl);
    this.socketService.initIoConnection(this.socketiourl);
    this.socketService.Onconnect().subscribe(() => {
      this.curnamespace = this.socketService.getNameSpace();
      //let newTitle = `${this.curnamespace}/${this.title}`;
      //this.titleService.setTitle(newTitle);
      //連線時傳送資料給server
      let resdata = {
        type: "DVR",
        namespace: this.curnamespace,
        username: "ttom"
      }
      this.socketService.Sendconnected(resdata);
      //加入頻道
      let data = {
        channel: this.title,
        username: "ttom"
      }
      this.socketService.Sendjoin(data);


    },
      (err) => { console.log('error: ' + err); });

    this.socketService.Onjoin().subscribe(data => {
      let fmtmsg = `${this.clientclassname}->[client ns:${this.curnamespace}]<join> data=${data.channel}`;
      //console.log(fmtmsg);
      // fmtmsg = `已加人 ${data.channel} 的頻道`;
      // this.snackBar.open(fmtmsg, '我知道了',
      //   {
      //     duration: 2000
      //   });
    });

  }
}
