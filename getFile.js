exports.get= function(jsonObj , socket , db , fs){

	function base64_encode(file) {
		console.log("Req file is "+file);
		if (fs.existsSync(file)) {
			// file exists
			// read binary data
	 	   var bitmap = fs.readFileSync(file);
	    	// convert binary data to base64 encoded string
	    	return new Buffer(bitmap).toString('base64');
		}
		return null;
	    
	}

	var encodedImage = base64_encode(jsonObj);
	if (encodedImage != null) {
		console.log("File found");
		socket.emit("getFileResults" , encodedImage);
	
	}else{
		console.log("File not found");
		socket.emit("getFileResults" , "0");
		
	}
	


}