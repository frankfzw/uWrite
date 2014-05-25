var upload_button,
    download_button ;

// execute on load
function updownload_init(){

    // alert("on updownload init");

    upload_button   = document.getElementById('upload_button'),
    download_button = document.getElementById('download_button');
    upload_button.onchange = onUpload;
    download_button.onclick = onDownload;	
};


// var data ={
//         a : "I am data a",
//         b : "I am data b"
// };
function onDownload(){

    // alert("on download");
    var data_str = window.sessionStorage.getItem("canvas_data");
    window.sessionStorage.removeItem("canvas_data");

    var file = new Blob([data_str],{type:"application/json"});
    var url = window.URL.createObjectURL(file);
    
    this.href = url; // download_button href
}

function onUpload(){ 
    
    // get file
    var file = upload_button.files[0];
    var fileReader = new FileReader();
    fileReader.readAsText(file);

    fileReader.onload = function(e){
    	//var data_str = JSON.parse(this.result);
    	
        window.sessionStorage.setItem("upload_canvas_data",this.result);
        // alert(JSON.stringify(data));
    }
}


