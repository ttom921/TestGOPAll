import { Injectable } from '@angular/core';
declare var msgpack: any;
declare var fdkAac: any;


@Injectable({
  providedIn: 'root'
})
export class H264DataService {

  constructor() { }
  //設定PCM的頭
  setHeader(pcm_combine_arr) {
    var chunkId = [82, 73, 70, 70];    // 4 區塊編號     big     "RIFF"
    var chunkSize = this.intTobytes(pcm_combine_arr.length + 36, 4);      // 4 總區塊大小    little    N+36
    var format = [87, 65, 86, 69];    // 4 檔案格式     BIG     "WAVE"
    var subchunk1ID = [102, 109, 116, 32]; // 4 子區塊1標籤   BIG     "fmt"
    var subchunk1Size = [16, 0, 0, 0];     // 4 子區塊1大小   little    16
    var audioFormat = [1, 0];        // 2 音訊格式     little    1(PCM)
    var numChannels = [1, 0];        // 2 聲道數量     little    1聲道
    var sampleRate = [64, 31, 0, 0];    // 4 取樣頻率     little    =取樣點/秒(HZ)
    var byteRate = [128, 62, 0, 0];   // 4 位元組率     little    =取樣點*位元深度/8
    var blockAlign = [4, 0];        // 2 區塊對齊     little    4
    var bitsPerSample = [16, 0];       // 2 位元深度     little    取樣位元深度
    var subchunk2ID = [100, 97, 116, 97];  // 4 子區塊2標籤   BIG     "data"
    var subchunk2Size = this.intTobytes(pcm_combine_arr.length, 4);   // 4 子區塊2大小   little    N

    return [].concat(chunkId).concat(chunkSize).concat(format).concat(subchunk1ID).concat(subchunk1Size).concat(audioFormat).concat(numChannels).concat(sampleRate).concat(byteRate).concat(blockAlign).concat(bitsPerSample).concat(subchunk2ID).concat(subchunk2Size);
  }
  intTobytes(value, segments) {

    let a = [];
    for (let i = segments - 1; i >= 0; i--) {
      a[i] = (value >> (8 * i)) & 0xFF;
    }

    return a;
  }

  intTobytesArr(arr) {
    let returnArr = [];
    for (let i = arr.length - 1; i >= 0; i--) {
      returnArr = returnArr.concat(this.intTobytes(arr[i], 2));
    }
    return returnArr;
  }

  decode(samples) {
    /** @type {!Int16Array} */
    let pcmSamples = new Int16Array(samples.length);
    for (let i = 0; i < samples.length; i++) {
      pcmSamples[i] = this.decodeSample(samples[i]);
    }
    return pcmSamples;
  }
  decodeSample(aLawSample) {
    /** @type {number} */
    let sign = 0;
    aLawSample ^= 0x55;
    if (aLawSample & 0x80) {
      aLawSample &= ~(1 << 7);
      sign = -1;
    }
    /** @type {number} */
    let position = ((aLawSample & 0xF0) >> 4) + 4;
    /** @type {number} */
    let decoded = 0;
    if (position != 4) {
      decoded = ((1 << position) |
        ((aLawSample & 0x0F) << (position - 4)) |
        (1 << (position - 5)));
    } else {
      decoded = (aLawSample << 1) | 1;
    }
    decoded = (sign === 0) ? (decoded) : (-decoded);
    return (decoded * 8) * -1;
  }
  public getH264data(Bufferary, H264obj) {
    //從檔案中先解碼
    let m = msgpack.decode(new Uint8Array(Bufferary));
    let pcm_combine_arr = [];
    let h264_combine_arr = [];
    // console.log(m.gop);
    //將資料放到video和audio的buffer中
    for (let num in m.gop) {
      // 找出第一個為true的key
      if (m.gop[num].key == true) {
        H264obj.flag = true;
      }
      if (H264obj.flag) {
        // feed video data
        // h264_combine_arr = h264_combine_arr.concat(Array.from(m.gop[num].v));

        H264obj.video_buffer[H264obj.video_buffer.length] = Array.from(m.gop[num].v);
        if (m.gop[num].key) {
          H264obj.key_buffer.push('I');
        }
        else {
          H264obj.key_buffer.push('P');
        }
        // video_buffer.push(m.gop[num].key);

        // feed audio data
        if (m.gop[num].a) {
          var pcm_data = this.decode(m.gop[num].a);
          var pcm_data_arr = this.intTobytesArr(Array.from(pcm_data));
          // pcm_combine_arr = pcm_combine_arr.concat(pcm_data_arr);
          H264obj.audio_buffer[H264obj.audio_buffer.length] = pcm_data_arr;
          // pcmPlayer.feed(pcm_data);
        }
      }
    }//for (let num in m.gop)

    //組合video和audio的資料
    // console.log(audio_buffer);

    let current_key;
    let temp_video_buffer = H264obj.video_buffer.slice(0); // clone video_buffer
    let temp_audio_buffer = H264obj.audio_buffer.slice(0); // clone audio_buffer
    let key_buffer_length = H264obj.key_buffer.length;
    for (var i = 0; i < key_buffer_length; i++) {

      current_key = H264obj.key_buffer[0];
      if (current_key == 'I')
        H264obj.i_count++;
      //console.log(`H264obj.i_count=${H264obj.i_count}`);
      if (H264obj.i_count === 2)
        break;
      H264obj.current_video = H264obj.current_video.concat(temp_video_buffer[i]);
      if (temp_audio_buffer[i])
        H264obj.current_audio = H264obj.current_audio.concat(temp_audio_buffer[i]);
      H264obj.key_buffer.shift();
      H264obj.video_buffer.shift();
      if (temp_audio_buffer[i])
        H264obj.audio_buffer.shift();
      // console.log('.....................................');
    }//for (var i = 0; i < key_buffer_length; i++)

    // if (H264obj.i_count === 2) {
    //   var pcm_header = this.setHeader(H264obj.current_audio);
    //   pcm_header = pcm_header.concat(Array.from(H264obj.current_audio));
    //   fdkAac(new Uint8Array(pcm_header), function (err, aac) {
    //     if (aac) {
    //       const file = ('File' in self)
    //         ? new File([aac.buffer], 'test.aac', { type: 'audio/aac' })
    //         // Safari does not have File in workers
    //         : new Blob([aac.buffer], { type: 'audio/aac' })
    //       const event = URL.createObjectURL(file);

    //       var node = document.createElement('audio');
    //       node.setAttribute("src", event);
    //       node.setAttribute("controls", "true");
    //       //node.setAttribute("style", "background-color:red; font-size:2em;");
    //       //先將聲音元件hide
    //       node.setAttribute("style", "display:none;");
    //       document.body.appendChild(node);

    //       //先存下來，之後傳送後在播
    //       // store_video_buffer.push(current_video);
    //       // store_audio_buffer.push(aac);
    //       // jmuxer.feed({
    //       //   video: new Uint8Array(current_video),
    //       //   audio: aac,
    //       //   duration: 1000
    //       // });
    //     }
    //   });
    //   //current_video = [];
    //   //current_audio = [];
    //   //i_count = 0;
    // }

  }
}
