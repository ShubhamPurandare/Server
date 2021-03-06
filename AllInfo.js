
const assert = require("assert");
var getFreeFaculties = require('./getFreeFaculties');
var facultySubjects = require('./FacultySubjects');
var consolere = require('console-remote-client').connect('console','80','VIConnectChannel');
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
		var grNumber = object.grNumber;
		var collectionName = object.collectionName;
		console.log("Collection is : "+ collectionName);
		var c = db.collection(collectionName); // takes the collection name and creates a collection variable




		

		if(collectionName=="TimeTable")
		{
			var id=infoObj._id;
			getFreeFaculties.calculateArrayOfFree(id,db);
		}
		
		var infoObj = JSON.parse(info);		
		console.log(infoObj);  // correctly parsed		
		var finalArray = new Array();
		//console.log(typeof contents);
		
		if (infoObj.Display_picture != null) {

			var encodedImage = infoObj.Display_picture;
			// its a request for setting dp
			var filename = "./Media/UserDP/"+grNumber+"dp";
			var fn = grNumber+"dp";
			storeAttachment("jpg" , encodedImage , filename);
			infoObj['Display_picture'] = fn;
			console.log("Image saved and now the infoObj is "+JSON.stringify(infoObj));
			

		}

		if (infoObj.tenththCertificate != null) {

			var encodedImage = infoObj.tenththCertificate;
			// its a request for setting dp
			var filename ="./Media/Certificates/"+ grNumber+"tenththCertificate";
			storeAttachment("jpg" , encodedImage , filename);
			infoObj['tenththCertificate'] = filename;
			console.log("Image saved and now the infoObj is "+JSON.stringify(infoObj));
			

		}

		if (infoObj.twelveththCertificate != null) {

			var encodedImage = infoObj.twelveththCertificate;
			// its a request for setting dp
			var filename ="./Media/Certificates/"+ grNumber+"twelveththCertificate";
			storeAttachment("jpg" , encodedImage , filename);
			infoObj['twelveththCertificate'] = filename;
			console.log("Image saved and now the infoObj is "+JSON.stringify(infoObj));
			

		}
	
		




		c.find({ "_id" :grNumber  }).toArray( function(error , result){

			console.log("The first element in the aray is :"+ JSON.stringify(result));

			if(error){
				throw error;
				socket.emit('Allinfo' , "0");
			} 
				
			if(result.length == 0){ // insert
				console.log("Earlier data entry not found ...");
				console.log("Inserting data...");
				c.insert({_id :grNumber });				
			}

				c.update({"_id":grNumber} , {$set:  infoObj }  );
				console.log("Data updated");
				console.log("Emmitting socket now .....");
					socket.emit('Allinfo' , "1");
					socket.disconnect();
					clients--;
					console.log("Client disconnected.... and clients are "+clients);
					// now validate the current database operation.
					info['_id'] = grNumber;
					//validateDBOperation(info , c , grNumber)

					loadSubjects(grNumber);

			


		});



var loadSubjects = function( id ){


	if(collectionName=="FacultyAllocation")
		{


			console.log(id);
			

			var one = id.substr(-11);
			var sem = one.substr(2,4);
			var d = id.length -11;
			var dept = id.substr(0 , d);
			var cr = id.substr(-4);

			console.log(sem);
			console.log(dept);
			console.log(cr);
			console.log(infoObj);
			

			var facArray = infoObj.object;

			for (var i = facArray.length - 1; i >= 0; i--) {
					var firstObj = facArray[i];
					var facCodeArray = firstObj.Faculty;
					for(var j=0;j<facCodeArray.length;j++)
					{
						var facCode = facCodeArray[j];
						console.log("facCode"+facCode)
						var jsonobj = {};
						jsonobj['EID'] = facCode;
						jsonobj['Branch'] = dept;
						jsonobj['Sem'] = sem;
						jsonobj['CurrentYear'] = cr;

						facultySubjects.facultySubjects(clients, socket , db , jsonobj);

					}
					//console.log("firstObj"+JSON.stringify(firstObj));
					

			}

			
		}



}
		
					
		


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

