
import HiPlayer from "./hi-player.js";
console.log("main.js start");

//let hiPlayer = null;
let hiPlayers = [];
var databufary0 = [];
var databufary1 = [];
//var nssocket = null;
let nssockets = [];
var curnamespace = "";
const socketurl = "http://localhost:50000/car-888";
//const socketurl = "http://172.18.2.49:50000/car-888";

//加入頻道
function Sendjoin(socket, data) {

    // let data = {
    //     channel: "channel1",
    //     username: "ttom"
    // };

    socket.emit("join", data);
}
function getNameSpace(socket) {
    console.log(socket);
    let ns = socket.nsp;
    return ns;
}
window.onload = () => {
    console.log("window.onload");
    for (let index = 0; index < 8; index++) {
        let element = new HiPlayer({
            node: 'player' + index,
            mode: 'both', /* available values are: both, audio and video */
            debug: false,
            audioType: 'mp3'
            // duration: 33
        });
        hiPlayers.push(element);
    }

}
document.getElementById("btnconnect0").onclick = () => {
    let idx = 0;
    let nssocket = null;
    console.log(`btnconnect${idx} click`);
    nssockets[idx] = io(socketurl, {
        // path: '/mypath'
    });
    nssocket = nssockets[idx];
    nssockets[idx].on('connect', () => {
        //console.log(socket);
        curnamespace = getNameSpace(nssockets[idx]);
        let fmtmsg = `[client ns:${curnamespace}]<connect> `;
        console.log(fmtmsg);
        //加入頻道
        let data = {
            channel: "channel1",
            username: "ttom"
        };
        Sendjoin(nssocket, data);

    });

    //收到資料
    nssockets[idx].on("bytemessage", (data) => {
        //let fmtmsg = `[client ns:${curnamespace}]<bytemessage>  data=${data.channel}`;
        //console.log(fmtmsg);

        databufary0.push(data.bufdata);
        let buffdata = databufary0.shift();
        //console.log(`H264obj.i_count=${H264obj.i_count}`);
        // h264Data.getH264data(buffdata, H264obj);
        let gopData = msgpack.decode(new Uint8Array(buffdata));
        hiPlayers[idx].feed(gopData);

    })
}
//----------------------------------------------------
document.getElementById("btnconnect1").onclick = () => {
    let idx = 1;
    let nssocket = null;
    console.log(`btnconnect${idx} click`);
    nssockets[idx] = io(socketurl, {
        // path: '/mypath'
    });
    nssocket = nssockets[idx];
    nssockets[idx].on('connect', () => {
        //console.log(socket);
        curnamespace = getNameSpace(nssocket);
        let fmtmsg = `[client ns:${curnamespace}]<connect> `;
        console.log(fmtmsg);
        //加入頻道
        let data = {
            channel: "channel1",
            username: "ttom"
        };
        Sendjoin(nssocket, data);

    });

    //收到資料
    nssockets[idx].on("bytemessage", (data) => {
        //let fmtmsg = `[client ns:${curnamespace}]<bytemessage>  data=${data.channel}`;
        //console.log(fmtmsg);

        databufary1.push(data.bufdata);
        let buffdata = databufary1.shift();
        //console.log(`H264obj.i_count=${H264obj.i_count}`);
        // h264Data.getH264data(buffdata, H264obj);
        let gopData = msgpack.decode(new Uint8Array(buffdata));
        hiPlayers[idx].feed(gopData);

    })
}
//----------------------------------------------------
document.getElementById("btnconnect2").onclick = () => {
    let idx = 2;
    let nssocket = null;
    console.log(`btnconnect${idx} click`);
    nssockets[idx] = io(socketurl, {
        // path: '/mypath'
    });
    nssocket = nssockets[idx];
    nssockets[idx].on('connect', () => {
        //console.log(socket);
        curnamespace = getNameSpace(nssocket);
        let fmtmsg = `[client ns:${curnamespace}]<connect> `;
        console.log(fmtmsg);
        //加入頻道
        let data = {
            channel: "channel1",
            username: "ttom"
        };
        Sendjoin(nssocket, data);

    });

    //收到資料
    nssockets[idx].on("bytemessage", (data) => {
        //let fmtmsg = `[client ns:${curnamespace}]<bytemessage>  data=${data.channel}`;
        //console.log(fmtmsg);

        databufary1.push(data.bufdata);
        let buffdata = databufary1.shift();
        //console.log(`H264obj.i_count=${H264obj.i_count}`);
        // h264Data.getH264data(buffdata, H264obj);
        let gopData = msgpack.decode(new Uint8Array(buffdata));
        hiPlayers[idx].feed(gopData);

    })
}
//----------------------------------------------------
document.getElementById("btnconnect3").onclick = () => {
    let idx = 3;
    let nssocket = null;
    console.log(`btnconnect${idx} click`);
    nssockets[idx] = io(socketurl, {
        // path: '/mypath'
    });
    nssocket = nssockets[idx];
    nssockets[idx].on('connect', () => {
        //console.log(socket);
        curnamespace = getNameSpace(nssocket);
        let fmtmsg = `[client ns:${curnamespace}]<connect> `;
        console.log(fmtmsg);
        //加入頻道
        let data = {
            channel: "channel1",
            username: "ttom"
        };
        Sendjoin(nssocket, data);

    });

    //收到資料
    nssockets[idx].on("bytemessage", (data) => {
        //let fmtmsg = `[client ns:${curnamespace}]<bytemessage>  data=${data.channel}`;
        //console.log(fmtmsg);

        databufary1.push(data.bufdata);
        let buffdata = databufary1.shift();
        //console.log(`H264obj.i_count=${H264obj.i_count}`);
        // h264Data.getH264data(buffdata, H264obj);
        let gopData = msgpack.decode(new Uint8Array(buffdata));
        hiPlayers[idx].feed(gopData);

    })
}
//----------------------------------------------------
document.getElementById("btnconnect4").onclick = () => {
    let idx = 4;
    let nssocket = null;
    console.log(`btnconnect${idx} click`);
    nssockets[idx] = io(socketurl, {
        // path: '/mypath'
    });
    nssocket = nssockets[idx];
    nssockets[idx].on('connect', () => {
        //console.log(socket);
        curnamespace = getNameSpace(nssocket);
        let fmtmsg = `[client ns:${curnamespace}]<connect> `;
        console.log(fmtmsg);
        //加入頻道
        let data = {
            channel: "channel1",
            username: "ttom"
        };
        Sendjoin(nssocket, data);

    });

    //收到資料
    nssockets[idx].on("bytemessage", (data) => {
        //let fmtmsg = `[client ns:${curnamespace}]<bytemessage>  data=${data.channel}`;
        //console.log(fmtmsg);

        databufary1.push(data.bufdata);
        let buffdata = databufary1.shift();
        //console.log(`H264obj.i_count=${H264obj.i_count}`);
        // h264Data.getH264data(buffdata, H264obj);
        let gopData = msgpack.decode(new Uint8Array(buffdata));
        hiPlayers[idx].feed(gopData);

    })
}
//----------------------------------------------------
document.getElementById("btnconnect5").onclick = () => {
    let idx = 5;
    let nssocket = null;
    console.log(`btnconnect${idx} click`);
    nssockets[idx] = io(socketurl, {
        // path: '/mypath'
    });
    nssocket = nssockets[idx];
    nssockets[idx].on('connect', () => {
        //console.log(socket);
        curnamespace = getNameSpace(nssocket);
        let fmtmsg = `[client ns:${curnamespace}]<connect> `;
        console.log(fmtmsg);
        //加入頻道
        let data = {
            channel: "channel1",
            username: "ttom"
        };
        Sendjoin(nssocket, data);

    });

    //收到資料
    nssockets[idx].on("bytemessage", (data) => {
        //let fmtmsg = `[client ns:${curnamespace}]<bytemessage>  data=${data.channel}`;
        //console.log(fmtmsg);

        databufary1.push(data.bufdata);
        let buffdata = databufary1.shift();
        //console.log(`H264obj.i_count=${H264obj.i_count}`);
        // h264Data.getH264data(buffdata, H264obj);
        let gopData = msgpack.decode(new Uint8Array(buffdata));
        hiPlayers[idx].feed(gopData);

    })
}
//----------------------------------------------------
document.getElementById("btnconnect6").onclick = () => {
    let idx = 6;
    let nssocket = null;
    console.log(`btnconnect${idx} click`);
    nssockets[idx] = io(socketurl, {
        // path: '/mypath'
    });
    nssocket = nssockets[idx];
    nssockets[idx].on('connect', () => {
        //console.log(socket);
        curnamespace = getNameSpace(nssocket);
        let fmtmsg = `[client ns:${curnamespace}]<connect> `;
        console.log(fmtmsg);
        //加入頻道
        let data = {
            channel: "channel1",
            username: "ttom"
        };
        Sendjoin(nssocket, data);

    });

    //收到資料
    nssockets[idx].on("bytemessage", (data) => {
        //let fmtmsg = `[client ns:${curnamespace}]<bytemessage>  data=${data.channel}`;
        //console.log(fmtmsg);

        databufary1.push(data.bufdata);
        let buffdata = databufary1.shift();
        //console.log(`H264obj.i_count=${H264obj.i_count}`);
        // h264Data.getH264data(buffdata, H264obj);
        let gopData = msgpack.decode(new Uint8Array(buffdata));
        hiPlayers[idx].feed(gopData);

    })
}
//----------------------------------------------------
document.getElementById("btnconnect7").onclick = () => {
    let idx = 7;
    let nssocket = null;
    console.log(`btnconnect${idx} click`);
    nssockets[idx] = io(socketurl, {
        // path: '/mypath'
    });
    nssocket = nssockets[idx];
    nssockets[idx].on('connect', () => {
        //console.log(socket);
        curnamespace = getNameSpace(nssocket);
        let fmtmsg = `[client ns:${curnamespace}]<connect> `;
        console.log(fmtmsg);
        //加入頻道
        let data = {
            channel: "channel1",
            username: "ttom"
        };
        Sendjoin(nssocket, data);

    });

    //收到資料
    nssockets[idx].on("bytemessage", (data) => {
        //let fmtmsg = `[client ns:${curnamespace}]<bytemessage>  data=${data.channel}`;
        //console.log(fmtmsg);

        databufary1.push(data.bufdata);
        let buffdata = databufary1.shift();
        //console.log(`H264obj.i_count=${H264obj.i_count}`);
        // h264Data.getH264data(buffdata, H264obj);
        let gopData = msgpack.decode(new Uint8Array(buffdata));
        hiPlayers[idx].feed(gopData);

    })
}

