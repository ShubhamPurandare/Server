
exports.getAttachments = function(jsonObj , fs, socket)
{


function base64_encode(file) {
    // read binary data

    var bitmap = fs.readFileSync(file);
   
    	 return new Buffer(bitmap).toString('base64');
    
    // convert binary data to base64 encoded string
   
}

var filename = jsonObj.filename;
console.log(JSON.stringify(filename));
var encodedData = base64_encode(filename);

	var obj = {};
	obj['filename' ] = filename;
	obj['encodedData'] = encodedData;
	console.log(JSON.stringify(obj));

	socket.emit('AttachmentsResults' , obj);



}