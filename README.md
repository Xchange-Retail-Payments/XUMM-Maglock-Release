# XUMM-Maglock-Release
Use XUMM to make a payment and release the Magock

Required:
XUMM APP and XRPL account Livenet or Testnet
Ardunio
Relay
Maglock
12v power source, (becareful if using mains power)
OLED Screen



(Maglock/public/images/Xumm%20MAglock%20Release.jpg)

Use the wiring Diagrams above to connect the Ardunio to the relay/maglock and ole, using the above wiring JPG.

Upload the maglock.ino to the Arduino.(make sure the serial monitor is closed on the Arduino)

CD to XUMM Maglock Release

>NPM install

We need the name of teh USB device
If on mac (Sorry, not sure on Windows command)
> ls /dev/tty*

or when in Arduino UI, Navigate to tools, the Port, add this port name to index.js line 25
> const sPort = new SerialPort('/dev/cu.usbmodem14201', { baudRate: 115200 });

Then Run

> nodemon

# Demo

