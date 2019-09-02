const PlantUML = module.exports;
const D = require('./definitions');
const { exec } = require('child_process');

PlantUML.toUML = function(frames) {
    let file = ['@startuml'];
    frames.forEach(frame => {
        if (frame.cmd !== 0x65 && frame.cmd !== 0x64 && frame.cmd !== 0x61) {
            file.push(format(frame));
        }
    });
    file.push('@enduml');
    return file.join('\n');
}

PlantUML.generateImage = function(jar, umlFile) {
    exec(`java -jar ${jar} "${umlFile}"`, (err, stdout, stderr) => {
        if (err) {
            console.log('Failed to generate uml file', err);
        } else {
            console.log('UML file generated!');
        }
    });
}

function format(frame) {
    return D.addresses[frame.src] + ' -> ' + D.addresses[frame.dst] + ': ' 
        + (D.commands[frame.cmd] || frame.cmd) 
        + ' (' + (D.isRegisterOperation(frame.cmd) ? D.registers[frame.arg] || frame.arg : frame.arg) + ')';
}