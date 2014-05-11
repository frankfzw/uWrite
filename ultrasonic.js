var b = require('bonescript');

var sysTime;
var INITLED = "USR0";
var STARTLED = "USR1";

//var for send
var ULTRASONIC_OUTPUT = "P8_4";			//send port
var CUT_OFF = "P3_6";					//cut port: voltage must same as the vcc
var PLUSE = 5;
var timer;


//var for receive
var GA = "";
var GB = "";
var GC = "";
var GD = "";
var INHIBIT1 = "";						//set low to receive signal
var INHIBIT2 = "";
var SIG1 = "";
var SIG2 = "";
var GA_NO = 0;
var GainTime[11] = {2380,2740,2750,2740,2740,2740,2750,2740,5490,5480,5490};

//var for start button
var START = "";
var boolean isStart = false;
var workTimer;

//var time
var START_TIME = 0;
var RECV1_TIME = 0;
var RECV2_TIME = 0;
var TOTAL_STEP = 11;					//set gain 11 times
var TIMEOUT = 20;

//setInterval(init, 1000);

function init()
{
    //light up the led 0
    b.pinMode(INITLED, b.OUTPUT);
    b.digitalWrite(INITLED, b.HIGH);
	
	//set start button
	b.pinMode(START, b.INPUT);
	b.attachInterrupt(START, true, b.RISING, startWork);
	b.attachInterrupt(START, true, b.FALLING, finishWork);
	
	//set start led
	b.pinMode(STARTLED, b.OUTPUT);
    b.digitalWrite(STARTED, b.LOW);
	
	//init the send port and cut port
	b.pinMode(ULTRASONIC_OUTPUT, b.OUTPUT);
	b.digitalWrite(ULTRASONIC_OUTPUT, b.LOW);
	b.pinMode(CUT_OFF, OUTPUT);
	b.digitalWrite(CUT_OFF, b.HIGH);
	
	//init the receive ports and interrupt
	b.pinMode(GA, b.OUTPUT);
	b.pinMode(GB, b.OUTPUT);
	b.pinMode(GC, b.OUTPUT);
	b.pinMode(GD, b.OUTPUT);
	
	b.pinMode(INHIBIT1, b.OUTPUT);
	b.digitalWrite(INHIBIT1, b.HIGH);
	b.pinMode(INHIBIT2, b.OUTPUT);
	b.digitalWrite(INHIBIT2, b.HIGH);
	
	b.attachInterrupt(SIG1, true, b.FALLING, recv1);
	b.attachInterrupt(SIG2, true, b.FALLING, recv2);
	
    
}

function send()
{
	b.digitalWrite(CUT_OFF, b.HIGH);
	
	int i = 0;
	for(; i < PLUSE; i ++)
	{
		b.digitalWrite(ULTRASONIC_OUTPUT,b.HIGH);
		delay(1);                     					//need to be tested here!!!
		b.digitalWrite(ULTRASONIC_OUTPUT,b.LOW);
		delay(1);
	}
	
	b.digitalWrite(CUT_OFF, b.LOW);
}

function receive()										//the version for short distance
{
	GA_NO = 0;			
	setGain(GA_NO);
	//setInterval(timerIsr, GainTime[GA_NO]);
	
	b.digitalWrite(INHIBIT1, b.LOW);
	b.digitalWrite(INHIBIT2, b.LOW);
}


function startWork()
{
	//init vars
	RECV1_TIME = 0;
	RECV2_TIME = 0;
	START_TIME = new Date.getTime();
	
	//turn on the led
	b.digitalWrite(STARTLED, b.HIGH);
	
	//enable receive
	receive();
	
	//enable send
	timer = setInterval(send, PLUSE * 2);
	
}

function finishWork()
{
	//init vars
	RECV1_TIME = 0;
	RECV2_TIME = 0;
	START_TIME = 0;
	
	//turn off the receiver and sender
	b.digitalWrite(INHIBIT1, b.HIGH);
	b.digitalWrite(INHIBIT2, b.HIGH);
	
	b.digitalWrite(ULTRASONIC_OUTPUT, b.LOW);
	b.digitalWrite(CUT_OFF, b.HIGH);
	
	//release interval
	clearInterval(timer);
	
	//turn off the led
	b.digitalWrite(STARTLED, b.LOW);
}

function delay(ms)
{
	var start = new Date().getTime();
	while(true)
	{
		if((new Date().getTime() - start) > n)
			break;
	}
}

function recv1()
{
	RECV1_TIME = new Date().getTime();
	d1 = (RECV1_TIME - START_TIME);
	b.digitalWrite(INHIBIT1, b.HIGH);					//turn off the receiver
	delay(PLUSE * 2);
	b.digitalWrite(INHIBIT1, b.LOW);					//wait and turn on again
}

function recv2()
{
	RECV2_TIME = new Date().getTime();
	d2 = (RECV2_TIME - START_TIME);
	b.digitalWrite(INHIBIT2, b.HIGH);
	delay(PLUSE * 2);
	b.digitalWrite(INHIBIT2, b.LOW);
	
}

function setGain(gainNo)
{
	switch (gainNo)
	{
		case 0:
		{
			b.digitalWrite(GA,b.LOW);
			b.digitalWrite(GB,b.LOW);
			b.digitalWrite(GC,b.LOW);
			b.digitalWrite(GD,b.LOW);
			break;
		}  
		case 1:
		{
			b.digitalWrite(GA,b.HIGH);
			b.digitalWrite(GB,b.LOW);
			b.digitalWrite(GC,b.LOW);
			b.digitalWrite(GD,b.LOW);
			break;
		}  
		case 2:
		{
			b.digitalWrite(GA,b.LOW);
			b.digitalWrite(GB,b.HIGH);
			b.digitalWrite(GC,b.LOW);
			b.digitalWrite(GD,b.LOW);
			break;
		}  
		case 3:
		{
			b.digitalWrite(GA,b.HIGH);
			b.digitalWrite(GB,b.HIGH);
			b.digitalWrite(GC,b.LOW);
			b.digitalWrite(GD,b.LOW);
			break;
		}  
		case 4:
		{
			b.digitalWrite(GA,b.LOW);
			b.digitalWrite(GB,b.LOW);
			b.digitalWrite(GC,b.HIGH);
			b.digitalWrite(GD,b.LOW);
			break;
		}  
		case 5:
		{
			b.digitalWrite(GA,b.HIGH);
			b.digitalWrite(GB,b.LOW);
			b.digitalWrite(GC,b.HIGH);
			b.digitalWrite(GD,b.LOW);
			break;
		}  
		case 6:
		{
			b.digitalWrite(GA,b.LOW);
			b.digitalWrite(GB,b.HIGH);
			b.digitalWrite(GC,b.HIGH);
			b.digitalWrite(GD,b.LOW);
			break;
		}  
		case 7:
		{
			b.digitalWrite(GA,b.HIGH);
			b.digitalWrite(GB,b.HIGH);
			b.digitalWrite(GC,b.HIGH);
			b.digitalWrite(GD,b.LOW);
			break;
		}  
		case 8:
		{
			b.digitalWrite(GA,b.LOW);
			b.digitalWrite(GB,b.LOW);
			b.digitalWrite(GC,b.LOW);
			b.digitalWrite(GD,b.HIGH);
			break;
		}  
		case 9:
		{
			b.digitalWrite(GA,b.HIGH);
			b.digitalWrite(GB,b.LOW);
			b.digitalWrite(GC,b.LOW);
			b.digitalWrite(GD,b.HIGH);
			break;
		}  
		case 10:
		{
			b.digitalWrite(GA,b.LOW);
			b.digitalWrite(GB,b.HIGH);
			b.digitalWrite(GC,b.LOW);
			b.digitalWrite(GD,b.HIGH);
			break;
		}  

		default:
		{
			b.digitalWrite(GA,b.HIGH);
			b.digitalWrite(GB,b.HIGH);
			b.digitalWrite(GC,b.LOW);
			b.digitalWrite(GD,b.HIGH);
			break;
		}  
	}
}

function timerIsr()
{
	GA_NO ++;
	if(GA_NO < 11)
	{
		setInterval(timerIsr, GainTime[GA_NO]);
		setGain(GA_NO);
	}
	else
	{
		clearInterval(timerIsr);
		RECV1_TIME = TIMEOUT;
		RECV2_TIME = TIMEOUT;
	}
}