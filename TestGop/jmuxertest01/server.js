const WebSocket = require('ws');
const fs = require('fs');

//const rawChunks = './raw/';
const rawChunks = './mini/';
//const rawChunks = './fz/';
const PORT = process.env.PORT || 8080;
let chunks = [],

    interval = 0,
    total = 0,
    current = 0,
    wss,
    filecount = 0;
soundchunks = [],
    totalsnd = 0;

fs.readdir(rawChunks, (err, files) => {
    //sound
    sndfiles = files.filter(file => file.indexOf('.aac') !== -1);
    sndfiles.forEach((file) => {
        fs.readFile(rawChunks + file, (err, data) => {
            if (err) throw err;
            soundchunks.push(data);
            totalsnd++;
            // if (sndfiles.length == total) {
            //     openSocket();
            // }
        });
    });
    //------------------------------------------------------------------
    /* bit crazy here :) */
    h264files = files.filter(file => file.indexOf('.h264') !== -1);
    filecount = h264files.length;
    // files = files.map(file => parseInt(file));
    // files.sort((a, b) => a - b);
    h264files.forEach((file) => {
        fs.readFile(rawChunks + file, (err, data) => {
            if (err) throw err;
            chunks.push(data);
            total++;
            if (h264files.length == total) {
                openSocket();
            }
        });
    });
});


function openSocket() {
    wss = new WebSocket.Server({ port: PORT });
    console.log('Server ready on port ' + PORT);
    wss.on('connection', function connection(ws) {
        console.log('Socket connected. sending data...');
        if (interval) {
            clearInterval(interval);
        }
        ws.on('error', function error(error) {
            console.log('WebSocket error=' + error);
        });
        ws.on('close', function close(msg) {
            console.log('WebSocket close');
        });

        interval = setInterval(function () {
            sendChunk();
        }, 1500);
    });
}

function sendChunk() {
    let chunk, soundchunk,
        anyOneThere = false;
    chunk = chunks[current];
    soundchunk = soundchunks[current];
    current++;
    if (current == total) current = 0;
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            anyOneThere = true;
            try {
                //var buf = Buffer.from(chunk);
                var videobuff = Buffer.from(chunk);
                var audiobuff = Buffer.from(soundchunk);
                var Duration = Buffer.alloc(2);//new Buffer(2);
                Duration.writeUInt16LE(1000, 0);
                var auddiolen = Buffer.alloc(4);//new Buffer(4);
                auddiolen.writeUInt32LE(audiobuff.length, 0);

                var totalLength = Duration.length + auddiolen.length + videobuff.length + audiobuff.length;
                var buf = []
                var buf = Buffer.concat([Duration, auddiolen, audiobuff, videobuff], totalLength);
                client.send(buf);
            } catch (e) {
                console.log(`Sending failed:`, e);
            }
            if (current % filecount == 0) {
                console.log(`I am serving, no problem!`);
            }
        }
    });

    if (!anyOneThere) {
        if (interval) {
            current = 0;
            clearInterval(interval);
            console.log('nobody is listening. Removing interval for now...');
        }
    }
}