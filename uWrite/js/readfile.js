






function readfile_r1(file) {
	
	var data = file.data;
	//console.log("file1.data: "+file.data);

	var arr = data.split("\n");
	var arr2 =[];
	for (var i = 0; i < arr.length-1; i++) {
		if(arr[i]>1000 && arr[i] < 10000)
			arr2.push(parseInt(arr[i]));
	};
	arr2.sort(function(x,y) {
		return x<y? -1:1;
	});
	console.log(arr2);
	var arrlen = arr2.length>5 ? 5 : arr2.length;

	var avg = 0;
	for (var i = 0; i < arrlen; i++) {
		avg += arr2[i];
	}

	avg /= arrlen;

	window.localStorage.setItem("d1",avg);
	//console.log("aaaa");
}
function readfile_r2(file) {
	
	var data = file.data;
	//console.log("file1.data: "+file.data);

	var arr = data.split("\n");
	var arr2 =[];
	for (var i = 0; i < arr.length-1; i++) {
		if(arr[i]>1000 && arr[i] < 10000)
			arr2.push(parseInt(arr[i]));
	};
	arr2.sort(function(x,y) {
		return x<y? -1:1;
	});
	console.log(arr2);
	var arrlen = arr2.length>5 ? 5 : arr2.length;

	var avg = 0;
	for (var i = 0; i < arrlen; i++) {
		avg += arr2[i];
	}

	avg /= arrlen;
	//console.log("avg:"+avg);
	window.localStorage.setItem("d2",avg);
	setTimeout(
		function(){
			if(window.localStorage.getItem("d1")!=null){
				var t1 = window.localStorage.getItem("d1");
				var t2 = window.localStorage.getItem("d2");
				var p =transPoint(t1/10,t2/10);
				console.log(p);
				
				window.localStorage.setItem("o_ultrasound_pos",JSON.stringify(p));
			}
		},1000
	);
	
    
}



