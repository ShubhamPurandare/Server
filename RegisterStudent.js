
exports.registerStudent = function(clients, data , callback , socket , db ){

			var callback = callback || function(){};
			var jsonData = JSON.parse(data);
			var data1 = jsonData.Array;
			var Grumber = jsonData.grNumber;
			var div = jsonData.div;
			var c = db.collection("Subjects");
			var field = data1.split(',');
			
		
			var i=0;
			while(i<field.length){

				console.re.log("Loop :"+i);
				console.re.log(field[i]);
				var str = field[i];
				var str1 = str.replace("[" , "");
				console.re.log(str1);
				var str2 =str1.replace(" " , "");
				console.re.log(str2);
				var str3 = str2.replace("]" , "");
				console.re.log(str3);
				sendData(socket , clients, db , str3 ,Grumber, div );
				i++;	
				
			}
			
					socket.disconnect();
					clients--;
					console.re.log("Client disconnected.... and clients are "+clients);
			
			


}


function sendData(socket ,clients , db ,  code, Grumber , div ){
			 var c = db.collection("Subjects");
			
			
				console.re.log("Code recieved is "+code);
				
				c.find( { _id : code }  ).toArray( function(error , result){
			
				if(error)throw err;

				if(result.length == 0 ){
					console.re.log("NO data found");
					console.re.log("We are registering the first student for this subject :"+code + " for div  "+div);
					
					c.insert({ _id: code , students: [ Grumber] })
					console.re.log("Inserted successfully!");
					
					
			
					

					
				}else{
				
				
				c.find( {_id:code }/*, { students : { $elemMatch :{$eq: Grumber } } }   */).toArray(function(err, result){
				
				console.re.log("Result is "+JSON.stringify(result));
				var obj = result[0];
				
				c.update( {"_id" :code } , {$addToSet : { students : Grumber  } } ,function(err , result){if(err)throw err;} );
				console.re.log("Student with GR Number "+Grumber +" registered successfuly");
						
				
				
				
				});
				
				
				
				
				}
			
			});
				
			
			}// end of func sendData
			
