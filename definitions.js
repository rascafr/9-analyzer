const D = module.exports;

D.headerBytes = [
    '5A', 'A5'
]

D.addresses = {
    '20': 'ESC',
    '21': 'BLE',
    '22': 'BMS',
    '23': 'Ext-BMS',
    '00': '?-ESC',
    '01': '?',
    '3D': 'APP',
    '3E': 'APP',
    '3F': 'APP',
}

D.commands = {
    '1':  'Ask read registers',
    '4':  'Response read registers',
    '61': 'Read registers, update head',
    '64': 'Update head display',
    '65': 'Update head sensors'
}