
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

var line = new Line();
console.log(line);
