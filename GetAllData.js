
exports.getAllData = function(clients , JsonData , db , socket){


			console.log("Inside getAllData listener...");
		
			var data = JSON.parse(JsonData);
			var grNumber = data.GrNumber;
			var collectionName = data.collectionName;
			var c = db.collection(collectionName); // takes the collection name and creates a collection variable
			
			console.log("id is "+grNumber);
			console.log("Collection name is "+collectionName);
			c.find({ "_id" :grNumber  }).toArray( function(error , result){
			
				if(error) throw error;
				
				if(result.length == 0){
					console.log("No data found.........");
					result = "0";
					socket.emit('Result' , result);		
					socket.disconnect();
					clients--;
					console.log("Client disconnected.... and clients are "+clients);
			
				
				}else{
				
				socket.emit('Result' , result);
				console.log("Data found and Socket emmitted....");
				socket.disconnect();
				clients--;
				console.log("Client disconnected.... and clients are "+clients);
			
			
				}
				
			
			});


}
