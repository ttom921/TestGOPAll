import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

//有關264的元件
import JMuxer from 'jmuxer';
import { GopFileService } from './services/gop-file.service';
import { H264DataService } from './services/h264-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {

  clientclassname = this.constructor.name;
  title = 'PlayAlone';
  urls = [];
  //#regin H264相關
  //i_count = { value: 1 };
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
  constructor(
    private gopFileService: GopFileService,
    private h264DataService: H264DataService
  ) { }
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {

    //初始化畫面元件
    this.jmuxer = new JMuxer({
      node: this.title,
      mode: 'video', /* available values are: both, audio and video */
      debug: true,
      duration: 1000
    });
  }
  ngOnDestroy(): void {
  }


  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      //讀所有的檔案
      const uploadPromises = [];
      let Bufferary = new ArrayBuffer(event.target.files.length);
      let filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        this.urls.push(event.target.files[i].name);
        let uploadPromise = this.gopFileService.GetBufferFromFile(event.target.files[i]);
        uploadPromises.push(uploadPromise);
      }
      Promise.all(uploadPromises).then(result => {
        for (let i = 0; i < filesAmount; i++) {
          Bufferary[i] = result[i];
          //console.log(Bufferary[i]);
        }
        let index = 0;
        setInterval(() => {
          //網路傳送
          //this.socketService.Sendbytemessage({ "channel": this.title, "bufdata": Bufferary[index] });
          //console.log(`channel:${this.title} ${index}`);
          this.JMuxer(Bufferary[index]);
          //console.log(`channel: ${index}`);
          index = (index + 1) % filesAmount;
        }, 800);

      });
    }
  }

  JMuxer(arybuf) {

    this.databufary.push(arybuf);
    let buffdata = this.databufary.shift();
    //console.log(`this.databufary length=${this.databufary.length}`);
    //console.log(`this.H264obj.i_count=${this.H264obj.i_count}`);
    this.h264DataService.getH264data(buffdata,this.H264obj);

    if (this.H264obj.i_count === 2) {
      //   //console.log(`this.videodataarray length=${this.videodataarray.length}`);
      this.jmuxer.feed({
        node: this.title,
        video: new Uint8Array(this.H264obj.current_video),
        //audio: new Uint8Array(this.audiodataarray[index])
        //audio: this.audiodataarray[index]
      });
      this.H264obj.i_count = 0;
      this.H264obj.current_video = [];
      this.H264obj.current_audio = [];
    }

  }
}
