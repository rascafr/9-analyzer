const fs = require('fs');
const clc = require('cli-color');
const blue = clc.blueBright;
const Parser = require('./parser');
const PlantUML = require('./plantuml');

const INPUT_FILE_LOG = `unlockThenRideHexNoParsingV2.log`;
const INPUT_PATH_LOG = `${__dirname}/logfiles/${INPUT_FILE_LOG}`;

// UML file (generated only if PLANTUML_PATH env variable exists)
const UML_FILE_LOG = `uml.txt`;
const UML_PATH_LOG = `${__dirname}/generated/${UML_FILE_LOG}`;

// Verbose file
const OUTPUT_FILE_LOG = `resume.log`;
const OUTPUT_PATH_LOG = `${__dirname}/generated/${OUTPUT_FILE_LOG}`;

const PLANTUML_PATH = process.env.PLANTUML_PATH;

console.log(blue('Reading file'), INPUT_PATH_LOG);

const logData = fs.readFileSync(INPUT_PATH_LOG)
let frames = Parser.parseHex(logData);
let txt = '';
frames.forEach(frame => {
    txt += Parser.frameToString(frame) + '\n';
});
fs.writeFileSync(OUTPUT_PATH_LOG, txt);

// generate uml sequence diagram?
if (PLANTUML_PATH) {
    let uml = PlantUML.toUML(frames);
    fs.writeFileSync(UML_PATH_LOG, uml);
    PlantUML.generateImage(PLANTUML_PATH, UML_PATH_LOG);
} else console.log('UML file skipped');

