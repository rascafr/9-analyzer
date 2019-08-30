const logLines = logData.toString()
    .split('\n')
    .map(l => l.replace('\n', '')
    .replace('\r', '')
    .trim())
    .filter(l => l.length && l !== LOG_HEADER)
    .map(l => l.split(' '));

console.log('Got', logLines.length, 'lines of log');

console.log(logLines[1]);

const LINES_TYPES = {};
let strLog = '';

logLines.forEach(line => {
    let sign = sha1(line.join(':'));
    if (!LINES_TYPES[sign]) {
        LINES_TYPES[sign] = line;
    }
    let msg = messageToString(parseMessage(line));
    console.log(msg);
    strLog += msg + '\n';
});

fs.writeFileSync(OUTPUT_PATH_LOG, strLog);

console.log('Different lines log values types:', Object.keys(LINES_TYPES).length);

function parseMessage(line) {

    const message = {
        length: null,
        src: null,
        dst: null,
        cmd: null,
        arg: null,
        payload: null
    }

    // check length
    if (line.length < 7) {
        console.log(line);
        throw 'Line error, invalid length';
    }

    // check header
    if (line[0] !== D.headerBytes[0] || line[1] !== D.headerBytes[1]) {
        console.log(line);
        throw 'Line error, invalid header';
    }

    // fill message
    message.length = line[2];
    message.src = line[3];
    message.dst = line[4];
    message.cmd = line[5];
    message.arg = line[6];
    // todo payload

    return message;
}

function messageToString(message) {
    let str = '';

    // who -> whom?
    str += `[${D.addresses[message.src]} --> `;
    str += `${D.addresses[message.dst]}] `;

    // command
    str += `using cmd ${D.commands[message.cmd] || '-----'} (${message.cmd}) `;

    // argument
    str += `and arg ${(message.arg < 10 ? ' ' : '') + message.arg} `;

    return str;
}

function hashCode(str) {
    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};