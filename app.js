

var express = require('express')

var connect = require('connect');
var app = express()

app.get('/dp_pics/:id', function (req, res, next) {
    var id = req.params.id;
    console.log('The id: ' + id);
 res.sendFile('/home/ubuntu/test/Server/Media/UserDP/'+id);


// res.sendFile('/home/shubham/'+id);
});

app.get('/' , function(req , res){

	res.end("Node-File-Upload");
});

app.get('/postpics/:id', function (req, res, next) {
    var id = req.params.id;
    console.log('The id: ' + id);
 res.sendFile('/home/ubuntu/test/Server/Media/PostMedia/'+id);

// res.sendFile('/home/shubham/'+id);
});

app.post('/upload', function(req, res) {
	console.log("In upload");
	console.log(req.files.image.originalFilename);
	console.log(req.files.image.path);
		fs.readFile(req.files.image.path, function (err, data){
		var dirname = "/home/shubham/Server/Images";
		var newPath = dirname + "/uploads/" + 	req.files.image.originalFilename;
		fs.writeFile(newPath, data, function (err) {
		if(err){
		res.json({'response':"Error"});
		}else {
		res.json({'response':"Saved"});
}
});
});
});


app.listen(8080);
console.log("Listening on port 8080");