var b;

var sysTime;
var INITLED = "USR0";
var STARTLED = "USR1";

//var for init
var isInit;

//var for send
var ULTRASONIC_OUTPUT = "P8_11";            //send port，io checked, function checked
var CUT_OFF = "P8_13";					    //cut port: voltage must same as the vcc, io checked, function checked
var PLUSE = 1000;
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
var START = "P8_19";                        //start buttion, io checked, function checked
var isStart;
var counter = 0;
var counterValue = 1;
var keyTimer;

//var time
var START1_TIME = 0;
var START2_TIME = 0;
var RECV1_TIME = 0;
var RECV2_TIME = 0;
var TOTAL_STEP = 11;					//set gain 11 times
var TIMEOUT = 20;

var DIS1 = 0;
var DIS2 = 0;

//setInterval(init, 1000);

//init();
//delay(10000);
//test();


function ultrasound_init()
{
    console.log("init");
    
    //init the state
    isInit = false;
    b = require('bonescript');
	
	b.pinMode('USR0', 'out');
	b.pinMode('USR1', 'out');
	b.pinMode('USR2', 'out');
	b.pinMode('USR3', 'out');
	b.digitalWrite('USR0', 0);
	b.digitalWrite('USR1', 0);
	b.digitalWrite('USR2', 0);
	b.digitalWrite('USR3', 0);
	
	
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
    b.pinMode(SIG1, b.INPUT);
	b.attachInterrupt(SIG1, true, b.FALLING, recv1);
    b.pinMode(SIG2, b.INPUT);
	b.attachInterrupt(SIG2, true, b.FALLING, recv2);
    
    //delay(2000);
    console.log("init done\n");
	//setTimeout(restore("hhhh"), 100);
    isInit = true;
    
    
}


function test()
{
    console.log("test");
    delay(10000);
    isStart = true;
    send();
}

function send()
{
	b.digitalWrite(CUT_OFF, b.HIGH);
	
    //START1_TIME = new Date().getTime();
    //START2_TIME = START1_TIME;
    DIS1 = DIS2 = 0;
	//var i = 0;
	//for(; i < PLUSE; i ++)
	//{
		
		//40KHz
		//12.5us high, 12.5us low
		
		b.digitalWrite(ULTRASONIC_OUTPUT,b.HIGH);
		//delay(1);                     					//need to be tested here!!!/
		b.digitalWrite(ULTRASONIC_OUTPUT,b.LOW);
		//delay(1);
	//}
	
	//b.digitalWrite(ULTRASONIC_OUTPUT, b.LOW);
    //delay(1000);
    console.log("send!!!!!!");
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
	START1_TIME = 0;
    START2_TIME = 0;
	DIS1 = DIS2 = 0;
	
	//turn on the led
	b.digitalWrite(STARTLED, b.HIGH);
	
	//enable receive
	receive();
	
	//enable send
	timer = setInterval(send, PLUSE);
    //send();
    
    console.log("startWork!");
	
	while (isInit && isStart)
	{
		DIS1 ++;
		DIS2 ++;
		var i;
		while(i < 1000)
		{
			i ++;
		}
	}
	
}

function finishWork()
{
	//init vars
	RECV1_TIME = 0;
	RECV2_TIME = 0;
	START1_TIME = 0;
    START2_TIME = 0;
	
	//turn off the receiver and sender
	b.digitalWrite(INHIBIT1, b.HIGH);
	b.digitalWrite(INHIBIT2, b.HIGH);
	
	b.digitalWrite(ULTRASONIC_OUTPUT, b.LOW);
	b.digitalWrite(CUT_OFF, b.HIGH);
	
	//release interval
   // console.log("finishWork:", timer);
	clearInterval(timer);
    timer = null;
   // console.log("finishWork:", timer);
	
	//turn off the led
	b.digitalWrite(STARTLED, b.LOW);
    
   // console.log("finishWork!");
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

//@huxueyang
var recv_d_1,
	recv_d_2,
	recv_tag_1 = false,
	recv_tag_2 = false;

function recv1()
{
    if(!(isInit && isStart))                            //get rid of impossible signal
        return;
    
	//RECV1_TIME = new Date().getTime();
	//var d1 = (RECV1_TIME - START1_TIME);
	var d1 = DIS1;
	//DIS1 = 0;
	b.digitalWrite(INHIBIT1, b.HIGH);					//turn off the receiver
	delay(1);
	b.digitalWrite(INHIBIT1, b.LOW);					//wait and turn on again
    
    console.log("recv1", d1);

    if(recv_tag_1 == true){
    	return; 
    }
    recv_tag_1 = true;
    recv_d_1 = d1;
}

function recv2()
{
    if(!(isInit && isStart))
        return;
        
	//RECV2_TIME = new Date().getTime();
	//var d2 = (RECV2_TIME - START2_TIME);
	var d2 = DIS2;
	//DIS2 = 0;
	b.digitalWrite(INHIBIT2, b.HIGH);
	delay(1);
	b.digitalWrite(INHIBIT2, b.LOW);
    
    console.log("recv2", d2);
	
    if(recv_tag_2 == true){
    	return; 
    }
    recv_tag_2 = true;
    recv_d_2 = d2;

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
      
      	// function at front end @huxueyang
       	onPenDown();
        //clearInterval(keyTimer);
    }
    else if(x.value == 0)
    {
        isStart = false;
        //counter = 0;
        finishWork();

        // function at front end @huxueyang
       	onPenUp();
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
	
    isStart = false;
	isInit = false;
    b.detachInterrupt(SIG1);
    b.detachInterrupt(SIG2);
    b.detachInterrupt(START);
    b.digitalWrite(INITLED, b.LOW);
    b.digitalWrite(STARTLED, b.LOW);
	
	//turn off receivers
	b.digitalWrite(INHIBIT1, b.HIGH);
	b.digitalWrite(INHIBIT2, b.HIGH);
    
    if(timer != null)
    {
        clearInterval(timer);
		timer = null;
    }
	
	DIS1 = DIS2 = 0;
}
