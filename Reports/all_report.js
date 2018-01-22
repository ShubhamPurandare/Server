
var mongo = require('mongodb').MongoClient;
var fs = require('fs');
var sizeof = require('object-sizeof');


mongo.connect('mongodb://BornCoders:radarockssmp1@ds111529.mlab.com:11529/viit' , function(err , db){

	if(err){
		throw err;
		console.log("Error connecting to mlab ...");
	}else{
		

	var c = db.collection("Load_Time_Table"); // takes the collection name and creates a collection variable
	var key = "Computer";
	
	c.find().toArray( function(error , result){
			
		if(error) throw error;
		
		var c=0;
		var arr = [];
		while(c != result.length){
			
			var item = result[c];
			var id = item._id;
			if(id.indexOf(key) >= 0){
				console.log("valid Document");
				arr.push(item);
				console.log(id);
			
			} 
		
			c++;
			if(c == result.length){
				//console.log(JSON.stringify(arr));
				//socket.emit("MatchingResult" , arr);
			}
		}	
		
		
			
		
});
}
});
