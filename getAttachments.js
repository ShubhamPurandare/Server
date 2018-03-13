
exports.getAttachments = function(jsonObj , fs, socket)
{


function base64_encode(file) {
    // read binary data

    var bitmap = fs.readFileSync(file);
   
    	 return new Buffer(bitmap).toString('base64');
    
    // convert binary data to base64 encoded string
   
}

var filename = jsonObj.filename;
console.re.log(JSON.stringify(filename));
var encodedData = base64_encode("./Media/PostMedia/"+filename);

	var obj = {};
	obj['filename' ] = filename;
	obj['encodedData'] = encodedData;
	console.re.log(JSON.stringify(obj));

	socket.emit('AttachmentsResults' , obj);



}