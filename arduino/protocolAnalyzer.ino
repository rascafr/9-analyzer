/*
  Serial Protocol Analyzer for Ninebot
  Connect serial data wire from scooter to RX1 (Arduino Mega2560)
  Rascafr - 2019
*/

#define ESC 0x20
#define BLE 0x21
#define BMS 0x22
#define IOT 0x3D
#define APP 0x3E

// throttle: 0x20 ... 0xC2

int c;
int state = 0; // 0: wait for header, 1: fill data
int curs = 0;
int data[100] = {0};
int len = 0;
int i;

void setup() {
  Serial.begin(115200);
  Serial1.begin(115200);
  Serial.println("Ready...");
}

void loop() {
  if (Serial1.available()) {
    c = Serial1.read();

    switch(state) {

      // detect header
      // 5A A5 bLen bSrcAddr bDstAddr bCmd bArg bPayload[bLen] wChecksumLE
      // header(2) + args(5) + payload + chksum(2) = 9 + payload length
      case 0:
        if (c == 0x5a) {
          state = 1;
          curs = 0;
          data[curs++] = c; // keep
        }
        break;

      // check second header
      // reset if bad
      case 1:
        if (c != 0xa5) {
          state = 0;
        } else {
          state = 2;
          data[curs++] = c; // keep
        }
        break;

      // continue
      // till we got length
      case 2:
        if (curs < 2 || (curs >= 2 && curs < (9 + data[2]))) {
          data[curs] = c;
          curs++; 
        } else {
          //if (data[5] != 0x5)
          state = 3;
          //else state = 0;
        }
        break;

      // done - print
      case 3:
        state = 4; // end

        // only BLE -> ESC
        if (data[3] == BLE && data[4] == ESC && data[5] == 0x65) {
          
          Serial.println("Got payload!");
          Serial.print("Full length (with header & checksum): ");
          Serial.println(curs);
          for (i=0;i<curs;i++) {
            Serial.print(data[i], HEX);
            Serial.print(' ');
          }
          Serial.println("\n---");
          Serial.print("> len: "); Serial.println(data[2], HEX);
          Serial.print("> src: "); Serial.print(data[3], HEX); Serial.print(" - "); printAddress(data[3]);
          Serial.print("> dst: "); Serial.print(data[4], HEX); Serial.print(" - "); printAddress(data[4]);
          Serial.print("> cmd: "); Serial.println(data[5], HEX);
          Serial.print("> arg: "); Serial.println(data[6], HEX);
          Serial.print("> payload: ");
          for (i=7;i<7+data[2];i++) {
            Serial.print(data[i], HEX);
            Serial.print(' ');
          }
          Serial.println("\n");
        }
        state = 0;
        break;
    }
  }
}

void printAddress(int a) {
  switch(a) {
    case 0x20: Serial.println("ESC"); break;
    case 0x21: Serial.println("BLE"); break;
    case 0x22: Serial.println("BMS"); break;
    case 0x23: Serial.println("Ext-BMS"); break;
    case 0x00: Serial.println("?-ESC"); break;
    case 0x01: Serial.println("?"); break;
    case 0x3D: Serial.println("APP"); break;
    case 0x3E: Serial.println("APP"); break;
    case 0x3F: Serial.println("APP"); break;
    default: Serial.println("---"); break;
  }
}