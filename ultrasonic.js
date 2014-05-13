var b = require('bonescript');

var sysTime;
var INITLED = "USR0";
var STARTLED = "USR1";

//var for init
var isInit;

//var for send
var ULTRASONIC_OUTPUT = "P8_11";    		//send port，io checked, function checked
var CUT_OFF = "P8_13";					    //cut port: voltage must same as the vcc, io checked, function checked
var PLUSE = 5;
var timer;


//var for receive
var GA = "P8_8";                            //io checked
var GB = "P8_10";                           //io checked
var GC = "P8_12";                          //io checked
var GD = "P8_14";                           //io checked
var INHIBIT1 = "P8_16";						//set low to receive signal, io checked
var INHIBIT2 = "P8_18";                     //io checked
var SIG1 = "P8_15";                         //io checked                 
var SIG2 = "P8_17";                         //io checked
var GA_NO = 0;
var GainTime = [2380,2740,2750,2740,2740,2740,2750,2740,5490,5480,5490];

//var for start button
var START = "P8_15";                        //start buttion, io checked, function checked
var isStart;
var counter = 0;
var counterValue = 1;
var keyTimer;

//var time
var START_TIME = 0;
var RECV1_TIME = 0;
var RECV2_TIME = 0;
var TOTAL_STEP = 11;					//set gain 11 times
var TIMEOUT = 20;

//setInterval(init, 1000);

init();


function init()
{
    console.log("init");
    
    //init the state
    isInit = false;
    
    //init timer
    timer = null;
    
    //light up the led 0
    b.pinMode(INITLED, b.OUTPUT);
    b.digitalWrite(INITLED, b.HIGH);
	
	
	//set start led
	b.pinMode(STARTLED, b.OUTPUT);
    b.digitalWrite(STARTLED, b.LOW);
	
	//init the send port and cut port
	b.pinMode(ULTRASONIC_OUTPUT, b.OUTPUT);
	b.digitalWrite(ULTRASONIC_OUTPUT, b.LOW);
	b.pinMode(CUT_OFF, b.OUTPUT);
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
	
    //set start button
    b.pinMode(START, b.INPUT);
	b.attachInterrupt(START, true, b.CHANGE, pushStart);
    //b.attachInterrupt(START, true, b.RISING, startWork);
	//b.attachInterrupt(START, true, b.FALLING, finishWork);
    
    //set up receiver
	b.attachInterrupt(SIG1, true, b.FALLING, recv1);
	b.attachInterrupt(SIG2, true, b.FALLING, recv2);
    
    //delay(2000);
    console.log("init done\n");
	//setTimeout(restore("hhhh"), 100);
    isInit = true;
    
}

function send()
{
	b.digitalWrite(CUT_OFF, b.HIGH);
	
	var i = 0;
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
    //an function is working
    if(timer != null)
        return;
    
	//init vars
	RECV1_TIME = 0;
	RECV2_TIME = 0;
	START_TIME = new Date().getTime();
	
	//turn on the led
	b.digitalWrite(STARTLED, b.HIGH);
	
	//enable receive
	receive();
	
	//enable send
	timer = setInterval(send, PLUSE * 2);
    
    console.log("startWork!");
	
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
    console.log("finishWork:", timer);
	clearInterval(timer);
    timer = null;
    console.log("finishWork:", timer);
	
	//turn off the led
	b.digitalWrite(STARTLED, b.LOW);
    
    console.log("finishWork!");
}

function delay(ms)
{
	var start = new Date().getTime();
	while(true)
	{
		if((new Date().getTime() - start) > ms)
			break;
	}
}


function recv1()
{
	RECV1_TIME = new Date().getTime();
	var d1 = (RECV1_TIME - START_TIME);
	b.digitalWrite(INHIBIT1, b.HIGH);					//turn off the receiver
	delay(PLUSE * 2);
	b.digitalWrite(INHIBIT1, b.LOW);					//wait and turn on again
    
    console.log("recv1", d1);
}

function recv2()
{
	RECV2_TIME = new Date().getTime();
	var d2 = (RECV2_TIME - START_TIME);
	b.digitalWrite(INHIBIT2, b.HIGH);
	delay(PLUSE * 2);
	b.digitalWrite(INHIBIT2, b.LOW);
    
    console.log("recv2", d2);
	
}



function pushStart()
{
    //isStart = ! isStart;
    //keyTimer = setInterval(startFunction, 1);
    if(isInit == false)
        return;
    delay(counterValue);
    b.digitalRead(START, checkKey);
    
}


function checkKey(x)
{
    console.log("checkKey:", x.value);
    
    if(x.value == 1)
    {
        isStart = true;
        //counter = 0;
        startWork();
        //clearInterval(keyTimer);
    }
    else if(x.value == 0)
    {
        isStart = false;
        //counter = 0;
        finishWork();
        //clearInterval(keyTimer);
    }
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

function restore(x)
{
    
    console.log(x);
    
    b.detachInterrupt(SIG1);
    b.detachInterrupt(SIG2);
    b.detachInterrupt(START);
    b.digitalWrite(INITLED, b.LOW);
    b.digitalWrite(STARTLED, b.LOW);
    
    if(timer != null)
    {
        clearInterval(timer);
    }
    
    console.log("system shutdown\n");
}
