#include <reg52.h> 
#include <stdio.h>
#include <string.h>

#define uchar unsigned char //????????
#define uint  unsigned int

sbit SMG_q = P0^0;
sbit SMG_b = P0^1;
sbit SMG_s = P0^2;	
sbit SMG_g = P0^3;
code unsigned char table[]=
			{0xc0,0xf9,0xa4,0xb0,0x99,0x92,0x82,0xf8,0x80,0x90}; //number on LED

sbit Trig = P1^0;
sbit Receiver1= P3^2;	// Receiver 0, Exteral Interrupt INT0
sbit Receiver2= P3^3;	// Receiver 1, Exteral Interrupt INT1

sbit Inh1 = P1^1;
sbit Inh2 = P1^2;

uchar outcomeH1;
uchar outcomeL1;
uchar outcomeH2;
uchar outcomeL2;

uchar flag1 = 0;
uchar flag2 = 0;
uchar flagWork = 0;

/*
//display number
void display(unsigned int da, unsigned char pos)
{
	P2=0XFF;			//
	da=da%10;	
	switch(pos){
	case 0:		//选择千位数码管，关闭其它位
		SMG_q=0;
		SMG_b=1;	
		SMG_s=1;		
		SMG_g=1;
		P2=table[da];	//输出显示内容
		break;
	case 1:		//选择百位数码管，关闭其它位
		SMG_q=1;
		SMG_b=0;	
		SMG_s=1;		
		SMG_g=1;
		P2=table[da];
		break;
	case 2:		//选择十位数码管，关闭其它位
		SMG_q=1;
		SMG_b=1;	
		SMG_s=0;		
		SMG_g=1;
		P2=table[da];
		break;
	case 3:		//选择个位数码管，关闭其它位
		SMG_q=1;
		SMG_b=1;	
		SMG_s=1;		
		SMG_g=0;
		P2=table[da];
		break;
	}	
}
*/


void delay(unsigned int t)   //参数 time 大小
{							     //决定延时时间长短
	while(t--);
}
			
// timer 1
void putstr(uchar * p_data, uint strlen);
void serial_init(){
	SCON =0x50;           // 0101 Mode=2 8-bit UART 
 	TMOD |=0x20;           // timer1: Mode=2 8-bit auto-reload 
	PCON =0x80;           // SMOD=1

	TH1 = 0xF3;           //baud rate = 4800, Fosc = 12 ; BIT SMOD = 1
	TL1 = 0xF3;

	// interrupt 
	//ET1 =0;               //necessary?? Timer 1 Overflow generate interrput
	ES  =1;               //Enable Serial
	
	TR1 =1;               //Enable Timer1
}

// timer 0
void ultra_init(){
	
	TMOD |= 0x01;		// timer 0: Mode=1 16-bit timer   

    Trig = 0;          //??????????
    Inh1  = 1;        //close the receiver
    Inh2 = 1;
    
    IT0=0;        //interrupt mode of INT0 ????????,??????
    IT1=0;
    
    EX0=0;        //??????
    EX1=0;
  
	//TR0 = 1;	 //Enable Timer0
}

/*
void delay_20us()
{  
    uchar bt ;
    for(bt=0;bt<100;bt++);
}

*/

void main(void)
{
	
	uint distance1;
	uint distance2;
	uchar uart_data[20];
	
	
	uint dis00 = 0;
	uint dis01 = 0;
	uint dis10 = 0;
	uint dis11 = 0;
	
	
	serial_init();
	ultra_init();
	EA = 1;               //Enable all 

	while(1)
	{
		if(flagWork == 1){
			flag1 = flag2 = 0;
			
					Trig = 1; 
					delay(20);
					Trig= 0;        //????20us???,?Trig??  
				 
					TR0=0;					// stop timer0
					TH0=0;  TL0=0;  //clear timer1
					TR0  = 1; 			// restart timer1

					Inh1 = 0;       // open recever1,2  
					Inh2 = 0;

					EX0=1;          //Enable INT0
					EX1=1;

					while(TH0 < 255);
					
					
					TR0=0;          //stop timer0
					EX0=0;          //diable INT0, INT1
					EX1=0;

			// wait for receiving 
			if( flag1 ==1 && flag2 == 1){
				
				// convert from time to distance.
				distance1 = outcomeH1; 
				distance1 = (distance1<<8)|outcomeL1;
				distance1 += 20;
				//distance1 /= 58;

				distance2 = outcomeH2; 
				distance2 = (distance2<<8)|outcomeL2;
				distance2 += 20;
				//distance2 /= 58;

				// send data(cm) to PC
				sprintf(uart_data,"data: %u,%u\n",distance1,distance2);
				putstr(uart_data,strlen(uart_data));
			}
			else{
				strcpy(uart_data,"error\n");
				putstr(uart_data,strlen(uart_data));
			}
			
			P2 = 0;	

			/*
			//display result
			dis00 = distance1 % 10;
			dis01 = distance1 / 10;
			dis10 = distance2 % 10;
			dis11 = distance2 / 10;
			
			
			t = 100;
			while(t > 0)
			{
			display(dis00, 3);
			delay(1000);
			display(dis01, 2);
			delay(1000);
			display(dis10, 1);
			delay(1000);
			display(dis11, 0);
			delay(1000);
				
			t --;
			}
			*/
			delay(100);
	  }

	}
	
	//return 0;
}

void interrupt0()  interrupt 0 {
		uchar tmp;
	
		EX0=0;				 //??????0 useless
		
		outcomeH1 =TH0;    //???????
    outcomeL1 =TL0;    //???????
    tmp = TH0;
		while(outcomeH1 != tmp){
				outcomeH1 =TH0;    //???????
				outcomeL1 =TL0;    //???????
				tmp = TH0;
		}
		
		flag1 = 1;   //????????
    Inh1 = 1;
}

void interrupt1()  interrupt 2 {
		uchar tmp;
	
		EX1=0;				 //disable INT1 useless?
		
		outcomeH2 =TH0;    
    outcomeL2 =TL0;   
		tmp	= TH0;
		while( tmp != outcomeH2){
				outcomeH2 =TH0;    
				outcomeL2 =TL0;    
				tmp	= TH0;
		}
	
		flag2 = 1;   	   //????????
    Inh2  = 1;
}	

void serial_IT() interrupt 4 
{
	uchar order;
	if(RI == 1){
		order = SBUF;
		if(order == 'y'){
			// start operation
			flagWork = 1;
		}
		if(order == 'n'){
			// stop operation
			flagWork = 0;
		}

		RI = 0;
	}
}

void putch(uchar dat)  
{
	SBUF=dat;    
	while(TI!=1)  ;
	TI=0;       
}

void putstr(uchar *p_data, uint strlen){
	uint i = 0;

	for (; i < strlen; ++i)
	{
		putch(p_data[i]);
	}
}