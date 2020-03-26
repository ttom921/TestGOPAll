import * as debug from '../util/debug';
import { MP4 } from '../util/mp4-generator.js';
import { AACRemuxer } from '../remuxer/aac.js';
import { Mp3Remuxer } from '../remuxer/mp3.js';
import { H264Remuxer } from '../remuxer/h264.js';
import { appendByteArray, secToTime } from '../util/utils.js';
import Event from '../util/event';

export default class RemuxController extends Event {

    constructor(streaming) {
        super('remuxer');
        this.initialized = false;
        this.trackTypes = [];
        this.tracks = {};
        this.mediaDuration = streaming ? Infinity : 1000;
    }

    addTrack(options) {
        if (options.mode === 'video' || options.mode === 'both') {
            this.tracks.video = new H264Remuxer();
            this.trackTypes.push('video');
        }
        if (options.mode === 'audio' || options.mode === 'both') {
            switch (options.audioType) {
                case 'mp3':
                    this.tracks.audio = new Mp3Remuxer();
                    break;
                default:
                    this.tracks.audio = new AACRemuxer();
                    break;
            }
            this.trackTypes.push('audio');
        }
    }

    reset() {
        for (let type of this.trackTypes) {
            this.tracks[type].resetTrack();
        }
        this.initialized = false;
    }

    destroy() {
        this.tracks = {};
        this.offAll();
    }

    flush() {
        if (!this.initialized) {
            if (this.isReady()) {
                this.dispatch('ready');
                
                for (let type of this.trackTypes) { 
                    let track = this.tracks[type];
                    let data = {
                        type: type,
                        payload: MP4.initSegment([track.mp4track], this.mediaDuration, track.mp4track.timescale),
                    };
                    this.dispatch('buffer', data);
                }
                debug.log('Initial segment generated.');
                this.initialized = true;
            }
        } else {
            for (let type of this.trackTypes) {
                let track = this.tracks[type];
                let pay = track.getPayload();
                if (pay && pay.byteLength) {
                    const moof = MP4.moof(track.seq, track.dts, track.mp4track);
                    const mdat = MP4.mdat(pay);
                    let payload = appendByteArray(moof, mdat);
                    let data = {
                        type: type, // audio ,
                        payload: payload,
                        dts: track.dts
                    };
                    this.dispatch('buffer', data);
                    let duration = secToTime(track.dts / 1000);
                    debug.log(`put segment (${type}): ${track.seq} dts: ${track.dts} samples: ${track.mp4track.samples.length} second: ${duration}`);
                    track.flush();
                }
            }
        }
    }

    isReady() {
        for (let type of this.trackTypes) {
            if (!this.tracks[type].readyToDecode || !this.tracks[type].samples.length) return false;
        }
        return true;
    }

    remux(data) {
        for (let type of this.trackTypes) { // video, audio
            let samples = data[type];
            if (type === 'audio' && this.tracks.video && !this.tracks.video.readyToDecode) continue; /* if video is present, don't add audio until video get ready */
            if (samples.length > 0) {
                this.tracks[type].remux(samples); //this.tracks.video = new H264Remuxer();  this.tracks.audio = new AACRemuxer() | this.tracks.audio = new Mp3Remuxer();
            }
        }
        this.flush();
    }
}
