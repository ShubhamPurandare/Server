
exports.getAllData = function(clients ,fs, JsonData , db , socket){

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

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

				var arr =[];
				var obj= result[0];
				if (collectionName == "basicUserDetails") {
					
					if (obj.Display_picture != null) {
						// get the encoded image from storage
						var filename= obj.Display_picture;
						var encodedImage = base64_encode(filename+".jpg"); 
						obj['Display_picture'] = encodedImage;
					}
					
				
				}
				arr.push(obj);
				
				socket.emit('Result' , arr);
				console.log("Data found and Socket emmitted....");
				socket.disconnect();
				clients--;
				console.log("Client disconnected.... and clients are "+clients);
			
			
				}
				
			
			});


}
