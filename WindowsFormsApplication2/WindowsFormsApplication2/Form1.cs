using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.Security.Permissions;
using System.IO.Ports;
using WebKit;
using System.Threading;




namespace WindowsFormsApplication2
{
    [PermissionSet(SecurityAction.Demand, Name = "FullTrust")]
    [System.Runtime.InteropServices.ComVisibleAttribute(true)]


    public partial class Form1 : Form
    {
        static SerialClass sc;
        public Form1()
        {
            sc = new SerialClass();
            sc.DataReceived += new SerialClass.SerialPortDataReceiveEventArgs(sc_DataReceived);

            d1Array = new List<double>();
            d2Array = new List<double>();
            workingFlag = false;

            mut = new Mutex();

            InitializeComponent();

            string url = new Uri("D:\\Courses\\HCI\\51\\fg\\uWrite\\home.html").AbsoluteUri;
            //string url = new Uri("D:\\Courses\\HCI\\51\\fg\\hello.html").AbsoluteUri;
            webKitBrowser1.Navigate(url);
            Load += new EventHandler(Form1_Load);
            //Console.WriteLine("init done\n");
            //Background bg = new Background();

            
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            this.webKitBrowser1.DocumentCompleted += new WebBrowserDocumentCompletedEventHandler(webKitBrowser1_DocumentCompleted);
            this.webKitBrowser1.UseJavaScript = true;

            //imply the alert in js
            webKitBrowser1.ShowJavaScriptAlertPanel += new ShowJavaScriptAlertPanelEventHandler(delegate(object o, ShowJavaScriptAlertPanelEventArgs s) {
            MessageBox.Show(s.Message);});
            
        }

        private void webKitBrowser1_DocumentCompleted(object sender, WebBrowserDocumentCompletedEventArgs e)
        {
            this.webKitBrowser1.GetScriptManager.ScriptObject = this;
            this.webKitBrowser1.GetScriptManager.EvaluateScript("var obj=window.external;");
            //Background bg = new Background();
            //bg.Test("hhehehehee\n");
        }

        public void Print(string message)
        {
            //MessageBox.Show(message);
            //this.webKitBrowser1.GetScriptManager.EvaluateScript("alert('holly !!!');");
            this.webKitBrowser1.GetScriptManager.CallFunction("alert", new Object[] { message });
        }

        public void Start()
        {
            if(workingFlag)
            {
                Print("The senser is already working\n");
                return;
            }
            workingFlag = true;
            Print("Start Working\n");
            sc.writeData("y");

            //Thread workingThread = new Thread(Working);
            //workingThread.Start();
            
            //this.webKitBrowser1.GetScriptManager.CallFunction("appendData", new Object[] {1, 2});  
        }

        public void Stop()
        {
            workingFlag = false;
            Print("Stop Working\n");
            sc.writeData("n");
        }

        public void PollData()
        {
            mut.WaitOne();
            string d1 = "";
            string d2 = "";
            for (int i = 0; i < d1Array.Count; i++)
            {
                d1 += d1Array[i].ToString() + "#";
                d2 += d2Array[i].ToString() + "#";
            }
            this.webKitBrowser1.GetScriptManager.CallFunction("appendData", new Object[] { d1, d2 });
            d1Array.Clear();
            d2Array.Clear();
            mut.ReleaseMutex();
            /*
            int j = 2;
            while (workingFlag)
            {
                sc.writeData("y");
                Thread.Sleep(2000);
                sc.writeData("n");


                for (int i = 0; i < d1Array.Count; i++)
                {
                    this.webKitBrowser1.GetScriptManager.CallFunction("appendData", new Object[] { d1Array[i], d2Array[i] });
                }
                d1Array.Clear();
                d2Array.Clear();

            }
            sc.writeData("n");
            */
            
        }

        public void sc_DataReceived(object sender, SerialDataReceivedEventArgs e, byte[] bits)
        {
            string data = Encoding.Default.GetString(bits);
            string[] words = data.Split(':');

            
            if (words[0].Contains("error"))
            {
                d1Array.Add(-1);
                d2Array.Add(-1);
            }

            if (words.Length > 1)
            {
                for (int i = 1; i < words.Length; i ++)
                {

                    if (words[i].Contains("error"))
                    {
                        d1Array.Add(-1);
                        d2Array.Add(-1);
                        break;
                    }

                    string[] disVec = words[i].Split(',');
                    double d1, d2 = -1;

                    d1 = Convert.ToDouble(disVec[0]);
                    d2 = Convert.ToDouble(disVec[1].Split('\n')[0]);
                    if (d1 < 1000 || d2 < 1000 || d1 < 0 || d2 < 0) { }
                    //Console.WriteLine("error\n");
                    else
                    {
                        mut.WaitOne();
                        d1Array.Add(d1);
                        d2Array.Add(d2);
                        mut.ReleaseMutex();
                        //d1 = d1 / 58;
                        // d2 = d2 / 58;
                        // Console.WriteLine(d1 + "\t" + d2);
                        //webKitBrowser1.GetScriptManager.EvaluateScript("alert(1)");
                        //Print("0000000");
                        //this.webKitBrowser1.GetScriptManager.CallFunction("alert", new Object[] { "aaaaaa!\n" });

                    }
                }
            }
           

            //Console.WriteLine(ByteToString(bits));
        }

      
        //private Background bg;
        private List<double> d1Array;
        private List<double> d2Array;
        private static Mutex mut;
        bool workingFlag;
       
    }

   
        
       //// static void Main(string[] Args)
       // {
       //     sc.writeData("y");
       //     sc.DataReceived += new SerialClass.SerialPortDataReceiveEventArgs(sc_DataReceived);
       //     sc.writeData("at");
       //     Console.ReadLine();
       //     //sc.closePort();
       // }
       
    

}
