

exports.login= function(clients, user ,users , socket , basicUserDetails, fs){

	var jsonobj = JSON.parse(user);
				var isAuth = 0;
				var username = jsonobj.username;
				var password = jsonobj.password; 
				


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

var getUserProfile = function(id){

	console.log("In get profile");
							
	basicUserDetails.find(
			{
				_id : id
			}
		).toArray(function(err , res){

			if (err) {throw err;}

			if (res.length !=0 ) {  // get user dp
					console.log("User found");
							

						var obj = res[0];
						if (obj.Display_picture != null) {
						// get the encoded image from storage
						var filename= obj.Display_picture;
						var encodedImage = base64_encode(filename+".jpg"); 
						if (encodedImage == null) {
								console.log("couldnot find dp");
							
							obj['Display_picture'] = "0";
						}else{
							obj['Display_picture'] = encodedImage;
							console.log("DP found and loaded");
						}
						
					}else{
						obj['Display_picture'] = "0";
					}

					console.log("Emitting socket now ...");
						console.log("Profile is "+JSON.stringify(obj));
							
					socket.emit('JSON', obj);

			}else{
				console.log("User profile not found");
			}


	});

}

				console.log("json string is "+jsonobj);
				// check if user exists
				console.log("logged in user is "+username + " Password "+password);
				users.find({
					 $and:[
						 {"username":username},
						 {"password":password} 
					      ]}
					   ).limit(1).toArray( function(error , result){
					console.log("username is "+jsonobj.username);
					if(error){
						throw error;
					}else{
						
						console.log(result.length);
						if(result.length != 0){//user exists hence log in the user .
							console.log("User found");						
							console.log(result);
							// load backup....
							 
							// var obj = result[0];
							 //var GrNumber = obj._id;
							 //console.log("Gr Number is :"+GrNumber);
							 
							 var finalObj = {};// final json obj which will store all data backup.
							 
							/* finalObj["Contents"] = allFieldsString;
							 console.log("Currently FinalObj contains :"+finalObj);
							 
							 for(var k=0 ; k< allFields.length ; k++){
							 
							 //	getBackup(finalObj ,allFields[k] ,GrNumber ,allFieldsString[k], k ,allFields.length);
							 
							 
							 }*/
							
							
							isAuth = 1;
							var resObject = result[0];
						
						}else{ // user doesnot exists 
							console.log("No corresponding account found , please signup first");
							isAuth = 0;
							
						}
						socket.emit('loginResult' , isAuth );
						if(isAuth == 1){
								console.log("Getting profile info");
								getUserProfile(resObject._id);
							
						}
					
					}

				});
				
				
		

}


				
		function getBackup(finalObj, collectionName , GrNumber , key, index, lastIndex){
		
			console.log("Loop "+index+" Getting backup for collectionName :"+collectionName +" and GrNumber :"+GrNumber +" key is "+key);
			console.log("Current status of final obj is "+finalObj);
			
			// get Backup
			
			var cursor = collectionName.find( {_id: GrNumber} ).limit(1);
			
			cursor.each(function (err, doc) {

     			if (doc != null) {
            			console.log(doc);
            			finalObj[key] = doc;
            			
            			// check if index equals last index, then emit a socket
            			
            			if(index == lastIndex){
            			
            			//socket.emit('AllBackup' , finalObj);
            			console.log("Emmitting socket...");
            			
            			// emit socket..
            			
            			
            			}
            			
            			

        		}else{
        		
        			console.log("No corresponding entry found for key :"+key);
        			
        		} 
		
		});// end of cursor
		
	}//end of function

			
