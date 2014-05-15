var canvas;
var $canvas;
var context;

// var for drawing on canvas
var draw_status; // true or false;
var start_pos;

// var for store data of lines and points 
var stripe_arr = {
	stripes : []
};
var point_arr = {
	points : [],
	color : "",
	stripe_width : 5
};

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

var polling_id;
function initPolling(){
	polling_id = setInterval(getPenPosition, 1);

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

function init(){

	canvas = document.getElementById("canvas");
	$canvas = $("#canvas");

	context = canvas.getContext("2d");
	context.shadowBlur=20;
	context.shadowColor="black";

	// canvas.onmousedown = onMouseDown;
	// canvas.onmousemove = onMouseMove;
	// canvas.onmouseup   = onMouseUp;
	// canvas.onmouseout  = onMouseUp;

	document.getElementById("ClearButton").onclick = clearCanvas;



}

//////////////////////////////////////////////////////////////////////
// legacy functions 
function getRelativePos(event){
	return {
		x : event.pageX - $canvas.offset().left,
		y : event.pageY - $canvas.offset().top
	}
}

function onMouseDown (event) {
	console.log("start to draw a line");

	start_pos = getRelativePos(event);
	draw_status = true;

	point_arr.points = [start_pos];
}

function onMouseMove(event){

	if(draw_status == true){

		context.beginPath();
		context.lineWidth="5";
		context.strokeStyle="green";
		context.moveTo(start_pos.x,start_pos.y);
		context.lineTo(getRelativePos(event).x,getRelativePos(event).y);
		context.stroke();

		start_pos = getRelativePos(event);
		console.log(start_pos);

		point_arr.points.push(start_pos);
	}
}
function onMouseUp (event) {

	if(draw_status == true){
		console.log("finish to draw a line");
		draw_status = false;
	}

	stripe_arr.stripes.push(point_arr);
	console.log("stripes"+ JSON.stringify(stripe_arr));
}

function clearCanvas(){
	context.clearRect(0,0,canvas.width,canvas.height);

}