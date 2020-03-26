### 如何建置專案
```
npm install
npm run build
```

### 開發時

注意在`rollup.config.js`的檔案要將sourcemap的設定設為`true`

在`example\index.html`裏加入`<script src="https://rawgit.com/kawanet/msgpack-lite/master/dist/msgpack.min.js"></script>`和`

<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.3/socket.io.js"></script>`
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="description"
        content="jMuxer - a simple javascript mp4 muxer for non-standard streaming communications protocol">
    <meta name="keywords" content="h264 player, mp4 player, mse, mp4 muxing, jmuxer, aac player">
    <title>JMuxer demo</title>
</head>
<script src="https://rawgit.com/kawanet/msgpack-lite/master/dist/msgpack.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.3/socket.io.js"></script>


<body>
    <button id="btnconnect">連線</button>
    <div id="container" style="width: 400px; margin: 0 auto;">
        <video width="400" controls autoplay poster="images/loader-thumb.jpg" id="player"></video>
    </div>
    <script type="text/javascript" src="jmuxer.min.js"></script>
</body>

</html>
```
在上面有加入按鈕
因為有自已的解碼方式所以有在`example`的資料夾有加入`h264data.js`在，因為使用有使用到`import`的指令所以在script要加入module的指令
```html
<script type="module">
        import H264Data from "./h264data.js";
        console.log("hello jmuxer");
        console.log("this is a test");
        var h264Data = new H264Data();
        var databufary = [];
        var H264obj = {
            i_count: 0,
            flag: false,
            video_buffer: [],
            audio_buffer: [],
            key_buffer: [],
            current_video: [],
            current_audio: [],
        }
        var jmuxer = null;
        var nssocket = null;
        var curnamespace = "";
        const socketurl = "http://localhost:3000/car-888";
        //加入頻道
        function Sendjoin(socket) {

            let data = {
                channel: "channel1",
                username: "ttom"
            };

            socket.emit("join", data);
        }
        function getNameSpace(socket) {
            console.log(socket);
            let ns = socket.nsp;
            return ns;
        }
        window.onload = () => {
            console.log("window.onload");
            jmuxer = new JMuxer({
                node: 'player',
                mode: 'video', /* available values are: both, audio and video */
                debug: true
            });
        }
        document.getElementById("btnconnect").onclick = () => {
            console.log("onClickConnect");

            nssocket = io(socketurl, {
                // path: '/mypath'
            });
            nssocket.on('connect', () => {
                //console.log(socket);
                curnamespace = getNameSpace(nssocket);
                let fmtmsg = `[client ns:${curnamespace}]<connect> `;
                console.log(fmtmsg);
                //加入頻道
                Sendjoin(nssocket);

            });
            //收到資料
            nssocket.on("bytemessage", (data) => {
                let fmtmsg = `[client ns:${curnamespace}]<bytemessage>  data=${data.channel}`;
                console.log(fmtmsg);

                databufary.push(data.bufdata);
                let buffdata = databufary.shift();
                //console.log(`H264obj.i_count=${H264obj.i_count}`);
                h264Data.getH264data(buffdata, H264obj);
                if (H264obj.i_count === 2) {
                    //console.log(`H264obj.current_video=${H264obj.current_video.length}`);
                    jmuxer.feed({
                        node: 'player',
                        video: new Uint8Array(H264obj.current_video),
                        //audio: new Uint8Array(this.audiodataarray[index])
                        //audio: this.audiodataarray[index]
                    });
                    H264obj.i_count = 0;
                    H264obj.current_video = [];
                    H264obj.current_audio = [];
                }
            })
        };
    </script>
    <script type="text/javascript" src="jmuxer.min.js"></script>
```



```
npm run dev
```
### 如何原碼偵錯
以vscode為主，先安裝[Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
1. 接下來在命令列下`npm run dev `
2. 在vscode下按下`Go Live`來起動web server
3. 在vscode的偵錯按下來選擇chrome，記得預設的port要改成5500
在瀏覽器中選擇`exapmle`資料夾就可以了，預設會執行`index.html`



### 產品階段
注意在`rollup.config.js`的檔案要將sourcemap的設定設為`false`
```
npm rund pro 
```