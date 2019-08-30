const D = module.exports;

D.headerBytes = [
    0x5a, 0xa5
]

D.addresses = {
    0x20: 'ESC',
    0x21: 'BLE',
    0x22: 'BMS',
    0x23: 'Ext-BMS',
    0x00: '?-ESC',
    0x01: '?',
    0x3d: 'APP',
    0x3e: 'APP',
    0x3f: 'APP',
}

D.commands = {
    0x1:  'Ask read registers',
    0x4:  'Response read registers',
    0x61: 'Read registers, update head',
    0x64: 'Update head display',
    0x65: 'Update head sensors'
}