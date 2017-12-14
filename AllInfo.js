
exports.allInfo = function(clients, data , db , socket ){

var roomCol = db.collection("Rooms");


console.log("In Allinfo listener...");
		var object = JSON.parse(data);
		var info = object.obj;
		console.log("Object is "+data)
		var contents = object.contents;
		var length = object.Length;
		var grNumber = object.grNumber;
		var collectionName = object.collectionName;
		console.log("Collection is : "+ collectionName);
		var c = db.collection(collectionName); // takes the collection name and creates a collection variable

		
		console.log("data extracted is "+ object + " "+ contents + " "+length + " "+grNumber + " "+collectionName);
		var infoObj = JSON.parse(info);		
		console.log(infoObj);  // correctly parsed		
		var finalArray = new Array();
		console.log(typeof contents);
		var field = contents.split(','); // recieved details are in csv form
					
		
		for(var i=0; i<length ; i++)
		{
		

					
			var component = field[i];
			var value = infoObj[component];
			
			// save the data in an array 
			finalArray[i] = {};
			finalArray[i].label = component;
			finalArray[i].value = value;
			console.log(finalArray[i].label+ " : "+ finalArray[i].value);		
		}

		
		
		c.find({ "_id" :grNumber  }).toArray( function(error , result){

			console.log("The first element in the aray is :"+ result);

			if(error) 
				throw error;

			if(result.length == 0){ // insert
				console.log("Earlier data entry not found ...");
				console.log("Inserting data...");
				c.insert({_id :grNumber });				
			}
			console.log("Updating data...");
				
			console.log("length is "+length);
			for(var i=0 ; i<length ; i++ ){

				console.log("loop"+i);
				  component = finalArray[i].label;
				 value = finalArray[i].value;

				console.log("Updating values  "+ component + ":"+value);
				c.update({"_id":grNumber }, {$set: { [component] : value}},function(err , result){if(err)throw err;});
				if(i === length){
					
				}

			}
					console.log("Emmitting socket now .....");
					socket.emit('Allinfo' , 1);
					socket.disconnect();
					clients--;
					console.log("Client disconnected.... and clients are "+clients);
					
/*function validateDBOperation(object , collection , priKey){

	collection.find({ "_id" :priKey  }).toArray( function(error , result){
	
		console.log("Object for primary key "+priKey +" is "+result);
		var obj = result[0];
		console.log("obj is "+obj);
		if(object == obj){
			console.log("Objects are equal");
		}else{
		
			console.log("Objects are not equal");
		
			}
		
	
		});
	}*/
			
					
	
		});
		
		if(collectionName == "Load_Time_Table"){
			console.log("Calling function loadUsedRooms");
			//loadUsedRooms(object , grNumber) ;	
		}
		
		//validateDBOperation(info ,grNumber , c);
					
		


}



