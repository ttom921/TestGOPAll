
import H264Data from "./h264data.js";
console.log("main.js start");
// var files = ["1561099386.gop", "1561099387.gop", "1561099388.gop", "1561099389.gop", "1561099390.gop", "1561099391.gop", "1561099392.gop", "1561099393.gop", "1561099394.gop", "1561099395.gop", "1561099396.gop", "1561099397.gop", "1561099398.gop", "1561099399.gop", "1561099400.gop", "1561099401.gop", "1561099402.gop", "1561099403.gop", "1561099404.gop", "1561099405.gop", "1561099406.gop", "1561099407.gop", "1561099408.gop", "1561099409.gop", "1561099410.gop", "1561099411.gop", "1561099412.gop", "1561099413.gop", "1561099414.gop", "1561099415.gop", "1561099416.gop", "1561099417.gop", "1561099418.gop", "1561099419.gop", "1561099420.gop", "1561099421.gop", "picture.jpg"]; // 蔡依林 
// window.gopFiles = files;
var encoder = new Mp3LameEncoder(8000, 128000);
var h264Data = new H264Data(encoder);
var H264obj = {
    i_count: 0,
    flag: false,
    video_buffer: [],
    audio_buffer: [],
    key_buffer: [],
    current_video: [],
    current_audio: [],
}
let jmuxer = null;
var databufary = [];
var nssocket = null;
var curnamespace = "";
const socketurl = "http://localhost:50000/car-888";
//const socketurl = "http://172.18.2.49:50000/car-888";

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
        mode: 'both', /* available values are: both, audio and video */
        debug: true,
        audioType: 'mp3'
    });
}
document.getElementById("btnconnect").onclick = () => {
    console.log("btnconnect click");
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
                audio: new Uint8Array(H264obj.current_audio)
            });
            H264obj.i_count = 0;
            H264obj.current_video = [];
            H264obj.current_audio = [];
        }
    })
}
