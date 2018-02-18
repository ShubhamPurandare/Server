

var mongo = require('mongodb').MongoClient;
var client = require('socket.io')();
var clients = 0;


mongo.connect('mongodb://BornCoders:radarockssmp1@ds111529.mlab.com:11529/viit' , function(err , db){

	if(err){
		throw err;
		console.log("Error connecting to mlab ...");
	}else{
		//var db = database.db("viit");
	

			console.log("Connected to mlab ...");
			var TimeTable = db.collection("Load_Time_Table");
			var sem = "Sem2";
			var dept = "Computer";
			var year = "BE";
			var div = "C";
			var time = 




	}
});	