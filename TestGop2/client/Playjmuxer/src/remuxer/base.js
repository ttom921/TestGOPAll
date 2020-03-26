import * as debug from '../util/debug';

let track_id = 1;
export class BaseRemuxer {

    static getTrackID() {
        return track_id++;
    }
    
    constructor() {
        this.seq = 1;
    }

    flush() {
        this.seq++;
        this.mp4track.len = 0;
        this.mp4track.samples = [];
    }

    isReady() {
        if (!this.readyToDecode || !this.samples.length) return null;
        return true;
    }
}
