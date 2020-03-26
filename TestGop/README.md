### TestGop0

這是在測試傳送連續圖片從模擬DVR傳送給server, server收到之後在傳送給Live Client

### jmuxertest

測試原來的h264的player播放8個頻𨔞,影片要自已轉

### jmuxertest01

測試原來的h264的player播放8個頻道，影片轉成小的H264檔

```
ffmpeg -i SampleVideo_1280x720_30mb.mp4 -c copy -map 0 -segment_time 2 -f segment %03d.mp4
```

將小的mp4轉成h264

```bash
for f in *.mp4; do ./ffmpeg -i "$f" -vcodec copy -an -bsf:v h264_mp4toannexb "${f:0:3}.h264"; done
```

將小的mp4轉成aac

```bash
for f in *.mp4; do ./ffmpeg -i "$f" -acodec copy -vn "${f:0:3}.aac"; done
```

在server裏組成他的格式，就可以播放

### jmuxer

這個是原版

#### 如何建置專案

```
npm install
npm run build
```

#### 開發時
注意在`rollup.config.js`的檔案要將sourcemap的設定設為`true`

在`example\index.html`裏加入`<script src="https://rawgit.com/kawanet/msgpack-lite/master/dist/msgpack.min.js"></script>`和`

<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.3/socket.io.js"></script>`

```bash
npm run dev
```

#### 如何原碼偵錯
以vscode為主，先安裝[Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
1. 接下來在命令列下`npm run dev `
2. 在vscode下按下`Go Live`來起動web server
3. 在vscode的偵錯按下來選擇chrome，記得預設的port要改成5500
在瀏覽器中選擇`exapmle`資料夾就可以了，預設會執行`index.html`