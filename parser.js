const Parser = module.exports;
const D = require('./definitions');
const fs = require('fs');

Parser.parseHex = function(fileBytes) {
    let frame = null;
    let frames = [];
    let index = 0;
    do {
        frame = extractFrame(fileBytes, index);
        if (frame) {
            frames.push(frame);
            index = frame.cursor;
        }
    } while (frame !== null);

    return frames;
}

function extractFrame(bytes, offset) {
    let state = 0;
    let c = null;
    let curs = offset;
    let done = false;
    let raw = [];
    
    while(!done && curs < bytes.length - 7) {
        c = byteRaw(bytes, curs);

        switch(state) {
            // detect header
            // 5A A5 bLen bSrcAddr bDstAddr bCmd bArg bPayload[bLen] wChecksumLE
            // header(2) + args(5) + payload + chksum(2) = 9 + payload length
            case 0:
                if (c == D.headerBytes[0]) {
                    state = 1;
                    raw.push(c); // keep
                }
                break;

            // check second header
            // reset if bad
            case 1:
                if (c != D.headerBytes[1]) {
                    state = 0;
                    done = true;
                } else {
                    state = 2;
                    raw.push(c); // keep
                }
                break;

            // continue
            // till we got length
            case 2:
                if (raw.length < 3 || (raw.length >= 3 && raw.length < 9 + raw[2])) {
                    raw.push(c);
                } else {
                    //if (data[5] != 0x5)
                    state = 3;
                    //else state = 0;
                }
                break;

            // done - print
            case 3:
                state = 4; // end
                done = true;
                break;
        }

        curs++;
    }

    if (state === 0) return null;

    return {
        raw: raw,
        cursor: curs,
        len: raw.length,
        blen: raw[2],
        src: raw[3],
        dst: raw[4],
        cmd: raw[5],
        arg: raw[6],
        payload: raw.filter((v, i) => i > 6 && i < raw.length - 2),
    }
}

function byteRaw(bytes, pos) {
    return bytes[pos];
}

function byteHex(bytes, pos) {
    return bytes[pos].toString(16);
}

Parser.frameToString = function(frame) {
    let str = '------ frame ------';
    str += '\n - raw: ' + toHexString(frame.raw);
    str += '\n - flow: ' + D.addresses[frame.src] + ' -> ' + D.addresses[frame.dst];
    str += '\n - cmd: ' + D.commands[frame.cmd];
    str += '\n - arg: ' + (D.isRegisterOperation(frame.cmd) ? D.registers[frame.arg] : frame.arg);
    str += '\n - payload: ' + toHexString(frame.payload);
    str += '\n - UTF payload: ' + new Buffer(frame.payload).toString();
    str += '\n';
    return str;
}

function displayFrame(frame) {
    console.log(Parser.frameToString(frame));
}

function toHexString(byteArray) {
    return Array.from(byteArray, function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join(' ')
}