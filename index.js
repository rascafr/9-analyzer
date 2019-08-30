const fs = require('fs');
const clc = require('cli-color');
const sha1 = require('js-sha1');
const blue = clc.blueBright;
const D = require('./definitions');
const Parser = require('./parser');

const INPUT_FILE_LOG = `unlockThenRideHexNoParsingV2.log`;
const INPUT_PATH_LOG = `${__dirname}/logfiles/${INPUT_FILE_LOG}`;
const LOG_HEADER = 'Ready...';

const OUTPUT_FILE_LOG = `resume.log`;
const OUTPUT_PATH_LOG = `${__dirname}/${OUTPUT_FILE_LOG}`;

console.log(blue('Reading file'), INPUT_PATH_LOG);

const logData = fs.readFileSync(INPUT_PATH_LOG)
Parser.parseHex(logData);
