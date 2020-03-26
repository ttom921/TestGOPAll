import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { PySocketioService } from 'src/app/services/py-socketio.service';
import { Title } from '@angular/platform-browser';

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
  car = "";
  @Input() title: string;
  @Input() socketiourl: string;


  constructor(
    private socketService: PySocketioService,
    private titleService: Title,

  ) { }

  ngOnInit() {

  }
  ngAfterViewInit(): void {
    //console.log(this.socketiourl);
    //console.log(this.clientclassname + "->ngAfterViewInit->" + this.title);

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
  TestStart(carname: string, conurl: string) {
    this.car = carname;
    this.socketiourl = conurl;
    console.log(this.socketiourl);

    this.socketService.initIoConnection(this.socketiourl);
    this.socketService.Onconnect().subscribe(() => {

      this.curnamespace = this.socketService.getNameSpace();
      this.JoinChannel();
      let newTitle = `${this.curnamespace}/${this.title}`;
      this.titleService.setTitle(newTitle);

    },
      (err) => { console.log('error: ' + err) });

    this.socketService.Onbytemessage().subscribe(data => {
      let fmtmsg = `${this.clientclassname}->[client ns:${this.curnamespace}]<bytemessage>  data=${data.channel}`;
      console.log(fmtmsg);
      data.bufdata = null;
    });
  }
  TestSendData(bufdata) {
    this.socketService.Sendbytemessage({ "channel": this.title, "bufdata": bufdata });
    console.log(`${this.car}=>channel:${this.title}`);
  }
}
