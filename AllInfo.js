
const assert = require("assert");
exports.allInfo = function(clients,fs ,  data , db , socket ){

var roomCol = db.collection("Rooms");


var storeAttachment = function(type , encodedData , filename){
		if (type == "jpg") {
			var data = "image"
		}else{
			data = type;
		}
		
		var base64Data = encodedData.replace(/^data:data\/type;base64,/, "");
		console.log(JSON.stringify(base64Data));
		fs.writeFile(filename+"."+type, base64Data, 'base64', function(err) {
		  console.log(err);
		});

	}

console.log("In Allinfo listener...");
		var object = JSON.parse(data);
		var info = object.obj;
		//console.log("Object is "+data)
		var contents = object.contents;
		var length = object.Length;
		var grNumber = object.grNumber;
		var collectionName = object.collectionName;
		console.log("Collection is : "+ collectionName);
		var c = db.collection(collectionName); // takes the collection name and creates a collection variable

		
	//	console.log("data extracted is "+ object + " "+ contents + " "+length + " "+grNumber + " "+collectionName);
		var infoObj = JSON.parse(info);		
		console.log(infoObj);  // correctly parsed		
		var finalArray = new Array();
		//console.log(typeof contents);
		var field = contents.split(','); // recieved details are in csv form
		
		if (infoObj.Display_picture != null) {

			var encodedImage = infoObj.Display_picture;
			// its a request for setting dp
			var filename = grNumber+"dp";
			storeAttachment("jpg" , encodedImage , filename);
			infoObj['Display_picture'] = filename;
			console.log("Image saved and now the infoObj is "+JSON.stringify(infoObj));
			

		}
		if (infoObj.Cover_picture != null) {

			var encodedImage = infoObj.Cover_picture;
			// its a request for setting dp
			var filename = grNumber+"cover_dp";
			storeAttachment("jpg" , encodedImage , filename);
			infoObj['Cover_picture'] = filename;
			console.log("Image saved and now the infoObj is "+JSON.stringify(infoObj));
			

		}

		




		c.find({ "_id" :grNumber  }).toArray( function(error , result){

			console.log("The first element in the aray is :"+ JSON.stringify(result));

			if(error){
				throw error;
				socket.emit('Allinfo' , 0);
			} 
				
			if(result.length == 0){ // insert
				console.log("Earlier data entry not found ...");
				console.log("Inserting data...");
				c.insert({_id :grNumber });				
			}

				c.update({"_id":grNumber} , {$set:  infoObj }  );
				console.log("Data updated");
				console.log("Emmitting socket now .....");
					socket.emit('Allinfo' , 1);
					socket.disconnect();
					clients--;
					console.log("Client disconnected.... and clients are "+clients);
					// now validate the current database operation.
					info['_id'] = grNumber;
					//validateDBOperation(info , c , grNumber)
			


		});




		
					
		


}

					
/*function validateDBOperation(object , collection , priKey){

	collection.find({ "_id" :priKey  }).toArray( function(error , result){
		var obj = result[0];
		
		console.log("Object for primary key "+priKey +" is "+JSON.stringify(obj));
		console.log("Actual obj is "+JSON.stringify(object));
		
		try{
		 assert.deepEqual(obj , object , "Data is loaded without any error") ;
		 }catch( e){
		 
		 console.log("Data is not loaded properly, calling the all info function again");
		 
		 
		 }
	
		});
}*/

