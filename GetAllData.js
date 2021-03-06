
exports.getAllData = function(clients ,fs, JsonData , db , socket , ObjectId){

function base64_encode(file) {
   if (fs.existsSync(file)) {
			// file exists
			// read binary data
	 	   var bitmap = fs.readFileSync(file);
	    	// convert binary data to base64 encoded string
	    	return new Buffer(bitmap).toString('base64');
		}
		return null;
}

var updates = db.collection("MyUpdates");


			console.re.log("Inside getAllData listener...");
		
			var data = JSON.parse(JsonData);
			var grNumber = data.GrNumber;
			var collectionName = data.collectionName;
			var type = data.isDocByObjectID;
			//console.re.log("Type is "+type);
			var c = db.collection(collectionName); // takes the collection name and creates a collection variable
			


			var checkIfTTObject = function(){

				if (collectionName == "Load_Time_Table") {

					if (data.senderID != null) {

						senderID = data.senderID;

				updates.find({"_id":senderID}).toArray(function(err,res){
					if(err)
					{
						throw(err);
					}

					if (res.length != 0) {


							console.re.log("ID is "+senderID);
							var obj = res[0];
							console.re.log(JSON.stringify(obj));
							
							updates.update({"_id":senderID }, {$set: { isTTUpdated:false}},function(err , result){if(err)throw err;});
						
				}
				
			});


					}

				}



			}




		
			if (type != null && type == "1") {
			
			/*
			This code executes for getting objects by ObjectID
			*/

			c.find({"_id" : ObjectId(grNumber)  }).toArray(function(err, res){


				if(err) throw err;
				
				if(res.length == 0){
					console.re.log("No data found.........");
					var result = "0";
					socket.emit('Result' , result);	
					socket.disconnect();
					clients--;
					console.re.log("Client disconnected.... and clients are "+clients);
			

				}else{



				var arr =[];
				var obj= res[0];
				if (collectionName == "Pages") {
					
					if (obj.CoverDp != null) {
						// get the encoded image from storage
						var filename= obj.CoverDp;
						var encodedImage = base64_encode(filename); 
						obj['CoverDp'] = encodedImage;
					}
				if (obj.DP != null) {
						// get the encoded image from storage
						var filename= obj.DP;
						var encodedImage = base64_encode(filename); 
						if (encodedImage == null) {
							obj['DP'] = "0";
						}else{
							obj['DP'] = encodedImage;
						}
						
					}
						
				
				}
				arr.push(obj);
				


					console.re.log("Data found and Socket emmitted....");
				
					socket.emit('Result' , arr);	
				

				}

			});


			}else{
				console.re.log("id is "+grNumber);
			console.re.log("Collection name is "+collectionName);
			c.find({ "_id" :grNumber  }).toArray( function(error , result){
			
				if(error) throw error;
				
				if(result.length == 0){
					console.re.log("No data found.........");
					result = "0";
					socket.emit('Result' , result);	
					socket.disconnect();
					clients--;
					console.re.log("Client disconnected.... and clients are "+clients);
			
				
				}else{

				var arr =[];
				var obj= result[0];
				if (collectionName == "basicUserDetails") {
					
					/*if (obj.Display_picture != null) {
						// get the encoded image from storage
						var filename= obj.Display_picture;
						var encodedImage = base64_encode(filename+".jpg"); 
						if (encodedImage == null) {
							obj['Display_picture'] = "0";
						}else{
							obj['Display_picture'] = encodedImage;
					
						}
						
					}*/
					
				
				}
				arr.push(obj);
				
				socket.emit('Result' , arr);
				checkIfTTObject();	

				console.re.log("Data found and Socket emmitted....");
				socket.disconnect();
				clients--;
				console.re.log("Client disconnected.... and clients are "+clients);
			
			
				}
				
			
			});
			}




			


}
