
const assert = require("assert");
var consolere = require('console-remote-client').connect('console.re','80','VIConnectChannel');
exports.allInfo = function(clients,fs ,  data , db , socket ){

var roomCol = db.collection("Rooms");


var storeAttachment = function(type , encodedData , filename){
		if (type == "jpg") {
			var data = "image"
		}else{
			data = type;
		}
		
		var base64Data = encodedData.replace(/^data:data\/type;base64,/, "");
		console.re.log(JSON.stringify(base64Data));
		fs.writeFile(filename+"."+type, base64Data, 'base64', function(err) {
		  console.re.log(err);
		});

	}

console.re.log("In Allinfo listener...");
		var object = JSON.parse(data);
		var info = object.obj;
		var grNumber = object.grNumber;
		var collectionName = object.collectionName;
		console.re.log("Collection is : "+ collectionName);
		var c = db.collection(collectionName); // takes the collection name and creates a collection variable

		
		var infoObj = JSON.parse(info);		
		console.re.log(infoObj);  // correctly parsed		
		var finalArray = new Array();
		//console.re.log(typeof contents);
		
		if (infoObj.Display_picture != null) {

			var encodedImage = infoObj.Display_picture;
			// its a request for setting dp
			var filename = "./Media/UserDP/"+grNumber+"dp";
			var fn = grNumber+"dp";
			storeAttachment("jpg" , encodedImage , filename);
			infoObj['Display_picture'] = fn;
			console.re.log("Image saved and now the infoObj is "+JSON.stringify(infoObj));
			

		}

		if (infoObj.tenththCertificate != null) {

			var encodedImage = infoObj.tenththCertificate;
			// its a request for setting dp
			var filename ="./Media/Certificates/"+ grNumber+"tenththCertificate";
			storeAttachment("jpg" , encodedImage , filename);
			infoObj['tenththCertificate'] = filename;
			console.re.log("Image saved and now the infoObj is "+JSON.stringify(infoObj));
			

		}

		if (infoObj.twelveththCertificate != null) {

			var encodedImage = infoObj.twelveththCertificate;
			// its a request for setting dp
			var filename ="./Media/Certificates/"+ grNumber+"twelveththCertificate";
			storeAttachment("jpg" , encodedImage , filename);
			infoObj['twelveththCertificate'] = filename;
			console.re.log("Image saved and now the infoObj is "+JSON.stringify(infoObj));
			

		}
	
		




		c.find({ "_id" :grNumber  }).toArray( function(error , result){

			console.re.log("The first element in the aray is :"+ JSON.stringify(result));

			if(error){
				throw error;
				socket.emit('Allinfo' , "0");
			} 
				
			if(result.length == 0){ // insert
				console.re.log("Earlier data entry not found ...");
				console.re.log("Inserting data...");
				c.insert({_id :grNumber });				
			}

				c.update({"_id":grNumber} , {$set:  infoObj }  );
				console.re.log("Data updated");
				console.re.log("Emmitting socket now .....");
					socket.emit('Allinfo' , "1");
					socket.disconnect();
					clients--;
					console.re.log("Client disconnected.... and clients are "+clients);
					// now validate the current database operation.
					info['_id'] = grNumber;
					//validateDBOperation(info , c , grNumber)
			


		});




		
					
		


}

					
/*function validateDBOperation(object , collection , priKey){

	collection.find({ "_id" :priKey  }).toArray( function(error , result){
		var obj = result[0];
		
		console.re.log("Object for primary key "+priKey +" is "+JSON.stringify(obj));
		console.re.log("Actual obj is "+JSON.stringify(object));
		
		try{
		 assert.deepEqual(obj , object , "Data is loaded without any error") ;
		 }catch( e){
		 
		 console.re.log("Data is not loaded properly, calling the all info function again");
		 
		 
		 }
	
		});
}*/

