var d = 200.0;  // distance between two receivers
var vspeed = 0.340; // voice speed mm/us
var scale = 0.6;
function isTriangle(a,b,c){
	if(a + b < c || a+c < b || b+c <a){
		//alert("not a triangle");
        //("#test_area").append("<p>It is not a triangle. Something wrong.</p>");
		return false;
	}
	return true
}
function set_distance(){
	d = $("#distance").val();
	console.log("set d to "+d);
}

function transPoint(t1,t2){
    //alert(t1 + "\t" + t2 + "\n");
     //$("#test_area").append("<p> t1 = "+t1+"&nbsp t2="+t2+"</p>");
    //("#test_area").append("<p>transPoint: d1 d2 "+t1+"&nbsp&nbsp"+t2+"</p>");
	var d1 = 0.3503 * t1 - 156.55;
	var d2 = 0.3503 * t2 - 156.55;
    //alert("triangle:\nd:" + d + "\td1:" + d1 + "\td2:" + d2);
	//console.log(d1);
	//console.log(d2);
    //("#test_area").append("<p>transPoint: d1 d2 "+t1+"&nbsp&nbsp"+t2+"</p>");
    // $("#test_area").append("<p> d1 = "+d1+"&nbsp d2="+d2+"</p>");
	if(isTriangle(d,d1,d2)){
		var point ={}
		point.y = parseInt(((d * d - d2 * d2 + d1 * d1)/ (2*d)).toFixed(0)) ;
		point.x = parseInt((Math.sqrt( d1*d1 - point.y * point.y)).toFixed(0)) ;
        point.y = point.y * 1.5+150;
        point.x = point.x * 1.5;
		//console.log(point);
       // alert("triangle:\nx:" + point.x + "\ty:" + point.y);
       // ("#test_area").append("<p> point.x="+point.x+"&nbsp point.y"+point.y+"</p>");
		return point;
	}
    return null;
}

function smooth(array){

	
	var length = array.length;
	if(length <3)
		return array;
	var originPoint = array;
	var midArray = [];
	var curvePoint=[];
	//生成中点
	for(var i =0; i< length; i++){
		var midpoint ={};
		var nexti =(i+1)% length
		midpoint.x = (array[i].x + array[nexti].x)/2.0;
		midpoint.y = (array[i].y + array[nexti].y)/2.0;
		midArray.push(midpoint);
	}
	//console.log(midArray)
	//平移中点
	var extraArray = [];
	for(var i = 0; i< length;i++){
		var nexti = (i + 1) % length;  
        var backi = (i + length - 1) % length;  
		var midinmid = {};

		midinmid.x = (midArray[i].x + midArray[backi].x)/2.0; 
		midinmid.y = (midArray[i].y + midArray[backi].y)/2.0;
		
		 var offsetx = originPoint[i].x - midinmid.x;  
         var offsety = originPoint[i].y - midinmid.y;  
        
		 var extrapoint = {};
		 extrapoint.x = midArray[backi].x + offsetx;  
         extrapoint.y = midArray[backi].y + offsety; 
		 //console.log(extrapoint);
         //朝 originPoint[i]方向收缩   
         var addx = (extrapoint.x - originPoint[i].x) * scale;  
         var addy = (extrapoint.y - originPoint[i].y) * scale;  
         extrapoint.x = originPoint[i].x + addx;  
         extrapoint.y = originPoint[i].y + addy;  
		// console.log(extrapoint);
         extraArray.push(extrapoint); 
          
		 var extrapoint={}; 
         extrapoint.x = midArray[i].x + offsetx;  
         extrapoint.y = midArray[i].y + offsety;  
         addx = (extrapoint.x - originPoint[i].x) * scale;  
         addy = (extrapoint.y - originPoint[i].y) * scale;  
         extrapoint.x = originPoint[i].x + addx;  
         extrapoint.y = originPoint[i].y + addy;  
         extraArray.push(extrapoint); 
           
	}
	//console.log(extraArray);
	
	for(var i = 0;i< length-1;i++)
	{
		var controlPoint=[];
		
		controlPoint.push(originPoint[i]);
		controlPoint.push(extraArray[2*i+1]);
		controlPoint.push(extraArray[(2*i+2)%(2*length)]);
		controlPoint.push(originPoint[(i+1)%length]);
		var u=1;
		while(u>=0){
		
			  var point = bezier3funcX(u,controlPoint);  
             // var py = bezier3funcY(u,controlPoint);  
              //u的步长决定曲线的疏密  
              u -= 0.1;  
              //var tempP = {x:px,y:py};  
              //存入曲线点   
              curvePoint.push(point);  
		}
	}
	return curvePoint;
}

function bezier3funcX(uu,controlP){
	var part0 = controlP[0].x * uu * uu * uu;  
	var part1 = 3 * controlP[1].x * uu * uu * (1 - uu);  
	var part2 = 3 * controlP[2].x * uu * (1 - uu) * (1 - uu);  
	var part3 = controlP[3].x * (1 - uu) * (1 - uu) * (1 - uu);   
	var xx= part0 + part1 + part2 + part3;
	part0 = controlP[0].y * uu * uu * uu;  
	part1 = 3 * controlP[1].y * uu * uu * (1 - uu);  
	part2 = 3 * controlP[2].y * uu * (1 - uu) * (1 - uu);  
	part3 = controlP[3].y * (1 - uu) * (1 - uu) * (1 - uu);   
	var yy= part0 + part1 + part2 + part3;
	var point={x:xx,y:yy};
	return point;   
}
