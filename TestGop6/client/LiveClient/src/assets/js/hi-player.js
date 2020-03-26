var mp3Encoder = new Mp3LameEncoder(8000, 64000);
class HiPlayer {
  constructor(options) {
    var defaultOptions = {
      ch: 1,              /* chanel number */
      node: 'player',     /* video tag ID */
      mode: 'both',       /* available values are: both, audio and video */
      debug: true,
      // duration: 1000
    };
    this.options = Object.assign({}, defaultOptions, options);
    this.flag = false;   /* 第一個video資料的I frame是否已經出現  */
    this.videoBuffer = [];
    this.audioBuffer = [];
    this.keyBuffer = [];
    this.pcmData = [];
    this.currentVideo = [];
    this.currentAudio = [];
    this.iCount = 0; // keyBuffer內 "I" 的數量
    this.jmuxer = new JMuxer(this.options);
    this.mp3Encoder = mp3Encoder;
    this.count = 0;
  }

  checkIsGopData(gopData) {
    return typeof gopData.gop[0] == 'undefined' ? false : true;
    // return typeof gopData.gop == 'undefined' ? false : true;
  }

  feed(gopData) {
    // 檢查 gop 資料是否正確
    if (this.checkIsGopData(gopData)) {

      if (gopData.gop[0].key == true)
        this.flag = true;

      if (this.flag) {
        this.count++;
        //console.log(gopData);
        // this.appendBuffer(gopData.gop.key, gopData.gop.v, gopData.gop.a);
        this.appendBuffer(gopData.gop[0].key, gopData.gop[0].v, gopData.gop[0].a);
        // this.appendBuffer(gopData[0].key, gopData[0].v, gopData[0].a);
        if (this.audioBuffer.length > 0) {
          this.currentAudio = this.currentAudio.concat(Array.from(this.audioBuffer.shift()));
        }
        this.currentVideo = this.currentVideo.concat(Array.from(this.videoBuffer.shift()));

        if (typeof this.currentAudio != 'undefined' && this.currentAudio.length != 0 && this.count >= 10) {
          this.jmuxer.feed({
            video: new Uint8Array(this.currentVideo),
            audio: new Uint8Array(this.currentAudio),
            duration: 333
          });
          this.currentAudio = [];
          this.currentVideo = [];
          this.count = 0;
        }
      }
    } else {
      this.resetFlag();
      this.videoBuffer = [];
      this.audioBuffer = [];
    }

  }

  appendBuffer(key, video, audio) {
    // push video data into videoBuffer
    this.appendVideoBuffer(video);
    // push I or P frame into keyBuffer
    this.appendKeyBuffer(key);
    // feed audio data
    this.appendAudioBuffer(audio);
  }

  pcmDataClear() {
    this.pcmData = [];
  }

  setPcmArrayRange() {
    var min = Math.min.apply(null, this.pcmData);
    var input_range = Math.max.apply(null, this.pcmData) - min;
    for (var i = 0; i < this.pcmData.length; i++) {
      this.pcmData[i] = (this.pcmData[i] - min) * 2 / input_range + (-1);
    }
  }

  intTobytes(value, segments) {
    var a = [];
    for (var i = segments - 1; i >= 0; i--) {
      a[i] = (value >> (8 * i)) & 0xFF;
    }
    return a;
  }

  intTobytesArr(arr) {
    var returnArr = [];
    for (var i = arr.length - 1; i >= 0; i--) {
      returnArr = returnArr.concat(intTobytes(arr[i], 2));
    }
    return returnArr;
  }

  // Convert Alaw to PCM
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

  appendVideoBuffer(videoData) {
    this.videoBuffer[this.videoBuffer.length] = Array.from(videoData);
  }

  appendAudioBuffer(audioData) {
    if (audioData) {
      this.pcmData = Array.from(this.decode(audioData));
      // console.log('---------- pcm data -----------');
      // console.log(this.pcmData);
      this.setPcmArrayRange();
      // console.log('---------- setPcmArrayRange -----------');
      // console.log(this.pcmData);
      var mp3code = this.mp3Encoder.encode([this.pcmData, this.pcmData]);

      // console.log('---------- mp3code -----------');
      // console.log(mp3code);

      this.audioBuffer[this.audioBuffer.length] = mp3code;
      this.pcmDataClear();
    }
  }

  appendKeyBuffer(key) {
    (key == true) ? this.keyBuffer.push('I') : this.keyBuffer.push('P');
  }

  resetICount() {
    this.iCount = 0;
  }

  clearCurrentVideo() {
    this.currentVideo = [];
  }

  clearCurrentAudio() {
    this.currentAudio = [];
  }

  resetFlag() {
    this.flag = false;
  }



}
