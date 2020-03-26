
import JMuxer from "./jmuxer";
import io from 'socket.io-client';
import H264Data from "./h264data";


console.log("hello webpack");
console.log("hello webpack");
console.log("hello webpack");
console.log("hello webpack");
console.log("hello webpack");
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


// //#region 原版測試
// function parse(data) {
//     var input = new Uint8Array(data),
//         dv = new DataView(input.buffer),
//         duration,
//         audioLength,
//         audio,
//         video;

//     duration = dv.getUint16(0, true);
//     audioLength = dv.getUint16(2, true);
//     audio = input.subarray(4, (audioLength + 4));
//     video = input.subarray(audioLength + 4);

//     return {
//         audio: audio,
//         video: video,
//         duration: duration
//     };
// }
// var socketURL = 'wss://jmuxer-demo-server.herokuapp.com';
// window.onload = () => {
//     jmuxer = new JMuxer({
//         node: 'player',
//         mode: 'video', /* available values are: both, audio and video */
//         debug: true
//     });
// }
// document.getElementById("btnconnect").onclick = () => {
//     var ws = new WebSocket(socketURL);
//     ws.binaryType = 'arraybuffer';
//     ws.addEventListener('message', function (event) {
//         var data = parse(event.data);
//         //jmuxer.feed(data);
//         jmuxer.feed({
//             node: 'player',
//             video: data.video,
//             audio: data.audio,
//         });
//     });

//     ws.addEventListener('error', function (e) {
//         console.log('Socket Error');
//     });
// }
// //#endregion 原版測試

// 3.通过使用事件监听的方式给元素添加绑定事件

// val el = document.getElementById("btn");
// if(el.addEventListener)
//     el.addEventListener("click",functionName,false);
// if(el.attachEvent)
//     el.attachEvent("onclick",functionName);

// function parse(data) {
//     var input = new Uint8Array(data),
//         dv = new DataView(input.buffer),
//         duration,
//         audioLength,
//         audio,
//         video;

//     duration = dv.getUint16(0, true);
//     audioLength = dv.getUint16(2, true);
//     audio = input.subarray(4, (audioLength + 4));
//     video = input.subarray(audioLength + 4);

//     return {
//         audio: audio,
//         video: video,
//         duration: duration
//     };
// }

// window.onload = function () {
//     var socketURL = 'wss://jmuxer-demo-server.herokuapp.com';
//     var jmuxer = new JMuxer({
//         node: 'player',
//         debug: true
//     });

//     var ws = new WebSocket(socketURL);
//     ws.binaryType = 'arraybuffer';
//     ws.addEventListener('message', function (event) {
//         var data = parse(event.data);
//         jmuxer.feed(data);
//     });
