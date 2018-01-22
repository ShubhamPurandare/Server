
exports.getData = function(clients , JsonData , db , socket){


	console.log("Inside getData listener...");
		
	var data = JSON.parse(JsonData);
	console.log("Data is "+JsonData);
	
	var key = data.Key;
	var coll = data.Collection;
	
	var c = db.collection(coll); // takes the collection name and creates a collection variable
	console.log("Coll is is "+JsonData);
	
	
	c.find().toArray( function(error , result){
			
		if(error) throw error;
		
		var c=0;
		var arr = [];
		while(c != result.length){
			
			var item = result[c];
			var id = item._id;
			console.log("Id is "+id);
			console.log("key is "+key);
			
			if(id.indexOf(key) >= 0){
				console.log("valid Document");
				arr.push(item);
			console.log("Matched ");
		
			} 
		
			c++;
			console.log("Loop "+c);
	
			if(c == result.length){
				console.log("Emmitting socket");
				
				socket.emit("MatchingResult" , arr);
			}
		}	
	
	
	
	});		
			


}


