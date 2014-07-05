namespace WindowsFormsApplication2
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.webKitBrowser1 = new WebKit.WebKitBrowser();
            this.SuspendLayout();
            // 
            // webKitBrowser1
            // 
            this.webKitBrowser1.AllowDrop = true;
            this.webKitBrowser1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.webKitBrowser1.BackColor = System.Drawing.Color.White;
            this.webKitBrowser1.Location = new System.Drawing.Point(0, 0);
            this.webKitBrowser1.Name = "webKitBrowser1";
            this.webKitBrowser1.Password = null;
            this.webKitBrowser1.PrivateBrowsing = false;
            this.webKitBrowser1.Size = new System.Drawing.Size(319, 255);
            this.webKitBrowser1.TabIndex = 0;
            //this.webKitBrowser1.Url = new System.Uri("D:\\Courses\\HCI\\51\\fg\\hello.html");
            this.webKitBrowser1.Url = null;
            this.webKitBrowser1.Username = null;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(282, 253);
            this.Controls.Add(this.webKitBrowser1);
            this.Name = "Form1";
            this.Text = "Form1";
            this.ResumeLayout(false);

        }

        #endregion

        private WebKit.WebKitBrowser webKitBrowser1;

    }
}

