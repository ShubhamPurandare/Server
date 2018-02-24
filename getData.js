
exports.getData = function(clients , JsonData , db , socket){


	console.re.log("Inside getData listener...");
		
	var data = JSON.parse(JsonData);
	console.re.log("Data is "+JsonData);
	
	var key = data.Key;
	var coll = data.Collection;
	
	var c = db.collection(coll); // takes the collection name and creates a collection variable
	console.re.log("Coll is is "+JsonData);
	
	
	c.find().toArray( function(error , result){
			
		if(error) throw error;
		
		var c=0;
		var arr = [];
		while(c != result.length){
			
			var item = result[c];
			var id = item._id;
			console.re.log("Id is "+id);
			console.re.log("key is "+key);
			
			if(id.indexOf(key) >= 0){
				console.re.log("valid Document");
				arr.push(item);
			console.re.log("Matched ");
		
			} 
		
			c++;
			console.re.log("Loop "+c);
	
			if(c == result.length){
				console.re.log("Emmitting socket");
				
				socket.emit("MatchingResult" , arr);
			}
		}	
	
	
	
	});		
			


}


