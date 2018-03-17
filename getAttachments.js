
exports.getAttachments = function(jsonObj , fs, socket)
{


function base64_encode(file) {
    // read binary data
 if (fs.existsSync(file)) {


   	 var bitmap = fs.readFileSync(file);
   
   	 return new Buffer(bitmap).toString('base64');
    }

    return null;
    // convert binary data to base64 encoded string
   
}

var filename = jsonObj.filename;
console.re.log(JSON.stringify(filename));
var encodedData = base64_encode("./Media/PostMedia/"+filename);
if (encodedData != null) {

	var obj = {};
	obj['filename' ] = filename;
	obj['encodedData'] = encodedData;
	console.re.log(JSON.stringify(obj));


	socket.emit('AttachmentsResults' , obj);


}else{

	socket.emit('AttachmentsResults' , "0");

}
	
	

}