var canvas;
var $canvas;
var context;

var draw_from_file_button;

// var for drawing on canvas
var draw_status; // true or false;
var start_pos;

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

function clearCanvas(){
	
	if (confirm(
		"Note that the previous note will be cleared! \
		 Be sure you save it or never need it！"))
	//if(r)
	{
		context.clearRect(0,0,canvas.width,canvas.height);
		note = new Note();
		return true;
	}
	return false;
}

var polling_id;
function initPolling(){

	// any bugs
//	polling_id = setInterval(function(){ getPenPosition() },1)；

}
function stopPolling(){
	clearInterval(polling_id);
}

function onPenDown(){
	initPolling();
}
function onPenUp(){

	draw_status = false;
	stopPolling();
}

function drawOnCanvas( position ){
	if(draw_status == false){
		start_pos = position;
		return ;
	}

	if(start_pos === undefined )
		console.error(" start_pos undefined");

	context.beginPath();
	context.lineWidth="5";
	context.strokeStyle="green";
	context.moveTo(start_pos.x,start_pos.y);
	context.lineTo(position);
	context.stroke();

	start_pos = position;
	//console.log(start_pos);

}

// Get d1,d2 from global objects
function getPenPosition(){
	if(recv_tag_1 == true && recv_tag_2 == true){
		var d1 = recv_d_1,
			d2 = recv_d_2;

		recv_tag_2 = recv_tag_1 = false;
		var position = transPoint(d1,d2);
		drawOnCanvas(position);

	}
}

function draw_from_file(){

	var data_str = window.sessionStorage.getItem("upload_canvas_data");
	var data;
	try{
		data = JSON.parse(data_str);
	}catch(e){
		alert("Sorry, this is not a valid upload file : "+e);
		return;
	}
	//alert("Successfully get the data: \n"+data_str);	


	// debug, should be deleted!
	var is_smooth = false;
	if(confirm("smooth?")){
		is_smooth = true;
	}

	//console.log("string data: "+JSON.stringify(data));
	if(clearCanvas()){

		//for(line in data.lines){
		for (var i = 0; i < data.lines.length; i++) {
			var line = data.lines[i];
	
			// console.log("string lines: "+JSON.stringify(data.lines));
			// console.log("string line: "+JSON.stringify(data.lines[0]));
			// console.log("string line: "+JSON.stringify(line));

			// call smooth function from calculate.js
			var smooth_line = smooth(line.points);
			console.log(smooth_line);

			// debug, should be deleted!
			var points;
			if(is_smooth){
				points = smooth_line;
			}else{
				points = line.points;
			}

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

}

function canvas_init(){

	// alert("on canvas init");

	canvas = document.getElementById("canvas");
	
	$canvas = $("#canvas");

	context = canvas.getContext("2d");
	context.shadowBlur=20;
	context.shadowColor="black";

	canvas.onmousedown = onMouseDown;
	canvas.onmousemove = onMouseMove;
	canvas.onmouseup   = onMouseUp;
	canvas.onmouseout  = onMouseUp;

	document.getElementById("clear_canvas_button").onclick = clearCanvas;

	draw_from_file_button = document.getElementById("draw_from_file_button");
	draw_from_file_button.onclick = draw_from_file;

	note = new Note();
}


// legacy functions 
function getRelativePos(event){
	return new Point(
		 event.pageX - $canvas.offset().left,
		 event.pageY - $canvas.offset().top
		 );
	
}

function onMouseDown (event) {
	console.log("start to draw a line");

	start_pos = getRelativePos(event);
	draw_status = true;

	line = new Line();
	line.add(start_pos);
	//point_arr.points = [start_pos];
}

var count =0; // for debug, should be delete!
function onMouseMove(event){

	if(draw_status == true){

		context.beginPath();
		context.lineWidth="5";
		context.strokeStyle="green";
		context.moveTo(start_pos.x,start_pos.y);
		context.lineTo(getRelativePos(event).x,getRelativePos(event).y);
		context.stroke();

		start_pos = getRelativePos(event);
		
		// debug
		if(count % 20 == 0){
			line.add(start_pos);
		}
		count ++;
		
	}
}
function onMouseUp (event) {

	if(draw_status == true){
		
		note.add(line);

		//console.log(JSON.stringify(note));

		window.sessionStorage.setItem("canvas_data",JSON.stringify(note));


		console.log("finish to draw a line");
		draw_status = false;

	}
}