uWrite
======

HCI Project : We want to record the writing track on any surface using ultrasonic senser and show it on the srceen.

The whole project can be divided into 3 parts:

1. The 8051 controller with ulstrasonic emitter which is bind on the pen and two receivers which are set on the left side of    writting plate.

2. The WindowsFormsApplication2 is a C# project, which contains the Serial Port component and the open-webkit-sharp component. The serial port component will set up a communication with 8051, to control the sensers and receive the data. The open-webkit-sharp is used to replace the C# defalut webBrowser so that we can run our html5 and js perfectly.

3. The forestage is finished in the first stage before we found out that Beaglebone wasn't suit for this scenario. So we keep it. It controls everything of our system and finally show what we write on the Canvas. We also add some trick algorithm to enhance the performance such as abnormal point detection and quadratic Bezier curve.


By Fu Zhouwang, Hu Xueyang and Qiao Liang @ SJTU
