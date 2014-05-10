var b = require('bonescript');

var sysTime;
var INITLED = "USR0";

var ULTRASONIC_OUTPUT = "P8_4";			//send port
var CUT_OFF = "P3_6";					//cut port: voltage must same as the vcc

setInterval(init, 1000);

function init()
{
    //light up the led 0
    b.pinMode(INITLED, b.OUTPUT);
    b.digitalWrite(INITLED, b.HIGH);
	
	//init the send port and cut port
	b.pinMode(ULTRASONIC_OUTPUT, b.OUTPUT);
	b.digitalWrite(ULTRASONIC_
    
}