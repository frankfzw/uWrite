var canvas;
var $canvas;
var context;

var draw_from_file_button;

// var for drawing on canvas
var draw_status; // true or false;
var start_pos;
var pathroot = "/home/root/ultrasonic/";
var filename_r1 = pathroot + "d1.data";
var	filename_r2 = pathroot + "d2.data";

// var for store data of lines and points
// var stripe_arr = {
// 	stripes : []
// };
// var point_arr = {
// 	points : [],
// 	color : "",
// 	stripe_width : 5
// };

function Point (x,y) {
	this.x = x;
	this.y = y;
}

function Line () {
 	this.points = [];
 	this.add = function(point) {
 		this.points.push(point);
 	};
} 

function Note () {
	this.lines = [];
	this.add = function(line) {
		this.lines.push(line);
	};
}
// var for store data of lines and points
var line,
	note;
var smooth_note;

function clearCanvas(){
	
   // alert("clearCanvas");
    
	/*if (confirm(
		"Note that the previous note will be cleared! \
		 Be sure you save it or never need it！"))
	//if(r)
	{*/
		context.clearRect(0,0,canvas.width,canvas.height);
		note = new Note();
		smooth_note = new Note();
        allPoints = [];
		return true;
       
	//}
	//return false;
}

var polling_id;
function initPolling(){

	// any bugs
	polling_id = setInterval(function(){ getPenPosition(); },PLUSE);

}
function stopPolling(){
	clearInterval(polling_id);
}

function onPenDown(){
	draw_status = false;
	console.log("on pen down");
	initPolling();
}
function onPenUp(){

	draw_status = false;
	stopPolling();
}

function onStartDraw( pos ){
    start_pos = pos;
}

function drawOnCanvas( position ){
	/*
    if(draw_status == false){
		start_pos = position;
		return ;
	}*/

	if(start_pos === undefined )
		console.error(" start_pos undefined");

	context.beginPath();
	context.lineWidth="5";
	context.strokeStyle="green";
	context.moveTo(start_pos.x,start_pos.y);
	context.lineTo(position.x,position.y);
	context.stroke();

	start_pos = position;
    
   //$("#test_area").append("<p>draw</p><br/>");
	//console.log(start_pos);

}

// Get d1,d2 from global objects
function getPenPosition(){
	if(recv_tag_1 == true && recv_tag_2 == true){
		var d1 = recv_d_1,
			d2 = recv_d_2;

			
		console.log("snowson: d1:"+d1+" d2:"+d2);	
		recv_tag_2 = recv_tag_1 = false;
		var position = transPoint(d1,d2);
		drawOnCanvas(position);

	}
}

function draw_from_file(){

	var data_str = window.sessionStorage.getItem("upload_canvas_data");
	//console.log(data_str);
	var data;
	try{
		data = JSON.parse(data_str);
	}catch(e){
		alert("Sorry, this is not a valid upload file : "+e);
		return;
	}
	//alert("Successfully get the data: \n"+data_str);	


	// debug, should be deleted!
	//var is_smooth = false;
	//if(confirm("smooth?")){
	//	is_smooth = true;
	//}

	//console.log("string data: "+JSON.stringify(data));
	//if(clearCanvas()){
	context.clearRect(0,0,canvas.width,canvas.height);
	note = new Note();
	smooth_note = new Note();
		//for(line in data.lines){
		for (var i = 0; i < data.lines.length; i++) {
			var line = data.lines[i];
	
			// console.log("string lines: "+JSON.stringify(data.lines));
			// console.log("string line: "+JSON.stringify(data.lines[0]));
			// console.log("string line: "+JSON.stringify(line));

			// call smooth function from calculate.js
			var smooth_line = smooth(line.points);
			//console.log(smooth_line);
			
			// debug, should be deleted!
			var points;
			//if(is_smooth){
				points = smooth_line;
			//}else{
			//	points = line.points;
			//}

			var start_pos = points[0];
			for (var k = 0; k < points.length; k++) {
				var point = points[k];
			

				context.beginPath();
				context.lineWidth="5";
				context.strokeStyle="green";
				context.moveTo(start_pos.x,start_pos.y);
				context.lineTo(point.x,point.y);
				context.stroke();

				start_pos = point;
			}
		}
	//}

}

function canvas_init(){

	// alert("on canvas init");

	canvas = document.getElementById("canvas");
	
	$canvas = $("#canvas");

	context = canvas.getContext("2d");
	context.shadowBlur=20;
	context.shadowColor="black";
	//$("#canvas").css("left",0);
 	canvas.onmousedown = onMouseDown;
	canvas.onmousemove = onMouseMove;
	canvas.onmouseup   = onMouseUp;
	canvas.onmouseout  = onMouseUp; 

	document.getElementById("clear_canvas_button").onclick = clearCanvas;

	draw_from_file_button = document.getElementById("draw_from_file_button");
	draw_from_file_button.onclick = draw_from_file;

	note = new Note();
	smooth_note = new Note();
}


function getUltraSoundRelativePos(pos){
	
	var o_ultrasound_pos = JSON.parse(window.localStorage.getItem("o_ultrasound_pos"));
	var o_mouse_pos = JSON.parse(window.localStorage.getItem("o_mouse_pos")); // the mouse position when hit to read file.
	console.log("o_mouse_pos: "+o_mouse_pos.x +" "+ o_mouse_pos.y);
	//var o_ultrasound_pos={};
	
	
	//pos = o_ultrasound_pos + (pos - o_mouse_pos);
	
	/*return new Point(
		  (pos.x),
		  (pos.y )
		 );
	*/
	//o_ultrasound_pos.x=50;
	//o_ultrasound_pos.y = 50;
	console.log(o_ultrasound_pos.x);
	console.log(pos.x);
	console.log(o_mouse_pos.x);
	 return new Point(
		 o_ultrasound_pos.x + (pos.x - o_mouse_pos.x),
		 o_ultrasound_pos.y + (pos.y - o_mouse_pos.y)
		 ); 
	
}

// legacy functions 
function getRelativePos(event){

	//var mouse_offset = window.localStorage.getItem("mouse_offset",mouse_offset);

	return new Point(
		 event.pageX - $canvas.offset().left,
		 event.pageY - $canvas.offset().top 
		 );
	
}

function onMouseDown (event) {
	console.log("start to draw a line");
	if(event.button == 1){
	
		var o_mouse_pos = getRelativePos(event);
		window.localStorage.setItem("o_mouse_pos",JSON.stringify(o_mouse_pos));
		
		setTimeout(
			function(){
			    window.localStorage.removeItem("d1");
				window.localStorage.removeItem("d2");
				b.readTextFile(filename_r1,readfile_r1);
				b.readTextFile(filename_r2,readfile_r2);
				//console.log("d1:"+ window.localStorage.getItem("d1"));
				//console.log("d2:"+d2);
				},
		2000);
	}else{
		start_pos = getRelativePos(event);
		
		
		start_pos = getUltraSoundRelativePos(start_pos);
		draw_status = true;

		line = new Line();
		line.add(start_pos);
	}
	//point_arr.points = [start_pos];
}

var count =0; // for debug, should be delete!
function onMouseMove(event){

	if(draw_status == true){

		var next_pos = getRelativePos(event);
		// 
		next_pos = getUltraSoundRelativePos(next_pos);
	
	
		context.beginPath();
		context.lineWidth="5";
		context.strokeStyle="green";
		context.moveTo(start_pos.x,start_pos.y);
		context.lineTo(next_pos.x,next_pos.y);
		context.stroke();

		
		//
		start_pos = next_pos;
		
		
		// debug
		if(count % 3 == 0){
			line.add(start_pos);
		}
		count ++;
		
	}
}
function onMouseUp (event) {

	if(draw_status == true){
		
		note.add(line);
		
		//console.log(note);
		//var smooth_line = smooth(line.points);
		//console.log(JSON.stringify(note));
		redraw();
		
		window.sessionStorage.setItem("canvas_data",JSON.stringify(note));


		console.log("finish to draw a line");
		draw_status = false;

	}
}
function deleteAbnormal(points){
    var ret = [];
    //alert("length = "+points.length);
    for(var i = 0;i<points.length;i++){
        var line = new Array();
        var tempLine = points[i];
        if(tempLine.length <= 1)
            continue;
        line.push(tempLine[0]);
        for(var k = 1; k < tempLine.length-1;k++){
            var dis = dist(tempLine[k-1],tempLine[k+1]);
            if( dist(tempLine[k], tempLine[k-1]) > 2 * dis && dist(tempLine[k], tempLine[k+1]) > 2 * dis )
                continue;
            else{
                line.push(tempLine[k]);
            }
        }
        line.push(tempLine[tempLine.length -1]);
        ret.push(line);
    }
    return ret;
}
function dist(p1,p2){
    return Math.sqrt( (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
}
function flushCanvas(points){
    context.clearRect(0,0,canvas.width,canvas.height);
    var ctx = context;
    for (var j = 0; j < points.length; j++) {
        var line = points[j];
         ctx.beginPath();
        ctx.moveTo(line[0].x, line[0].y);
        var i;

        for (i = 1; i < line.length - 2; i ++)
        {
          var xc = (line[i].x + line[i + 1].x) / 2;
          var yc = (line[i].y + line[i + 1].y) / 2;
          ctx.quadraticCurveTo(line[i].x, line[i].y, xc, yc);
        }
         // curve through the last two points
         ctx.quadraticCurveTo(line[i].x, line[i].y, line[i+1].x,line[i+1].y);
         ctx.stroke();
        
        
       /* var smooth_line = smooth(line);			
    
        var start_pos = smooth_line[0];
        for (var k = 0; k < smooth_line.length; k++) {
            var point = smooth_line[k];
           
            context.lineWidth="5";
            context.strokeStyle="green";
            context.moveTo(start_pos.x,start_pos.y);
            context.lineTo(point.x,point.y);
            context.stroke();

            start_pos = point;
        }*/
    }
   // 
    
}
function redraw(){
	smooth_note = new Note();
	for(var i =0;i < note.lines.length;i++){
		var o ={};
		o.points = smooth(note.lines[i].points);
		smooth_note.add(o);
	}
	context.clearRect(0,0,canvas.width,canvas.height);
		for (var i = 0; i < smooth_note.lines.length; i++) {
			var points = smooth_note.lines[i].points;
			// debug, should be deleted!

			var start_pos = points[0];
			for (var k = 0; k < points.length; k++) {
				var point = points[k];
			

				context.beginPath();
				context.lineWidth="5";
				context.strokeStyle="green";
				context.moveTo(start_pos.x,start_pos.y);
				context.lineTo(point.x,point.y);
				context.stroke();

				start_pos = point;
			}
		}
}