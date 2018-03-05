
exports.facultyTT = function(clients, socket , db , jsonobj , TTFacultyColl){


	console.re.log("IN fetchFacultyTT");
			var data = JSON.parse(jsonobj);
			console.re.log("Data is "+data);
			var arrayOfTokens = data.ArrayOftokens;
			console.re.log("Tokens are :"+arrayOfTokens);
			
			var EID = data.Name;
			var branch = "Computer"
			var sem = "Sem2"
			var token = "ComputerTESem2C"
			var mon = [];
			var tues = [];
			var wed = [];
			var thrus = [];
			var fri = [];
			var sat = [];
			var tokens = new Array("Monday","Tuesday", "Wednesday","Thursday","Friday", "Saturday");
			var object = {}; 
			//console.re.log(tokens);
			
			
		
		
			TTFacultyColl.find().forEach(  function(doc){
		
			//console.re.log(doc);
			var id = doc._id;
			if(arrayOfTokens.indexOf(id) != -1    ){
			
				console.re.log("Valid Document");
				for (var i=0; i< tokens.length ; i++){
				console.re.log("length "+tokens.length);
								
					console.re.log(tokens[i]);
					var day = tokens[i]
					var week = doc[day];
					
					var main = id.substr(-5);
							var div = main.substr(0 , 1);
							var one = id.substr(-11);
							var year = one.substr(0,2);
							var d = id.length -11;
							var dept = id.substr(0 , d);
						
					
					console.re.log(week.length);
					for(var j=0 ; j<week.length; j++){
						var temp = week[j]; // temp is the actual tt object
							temp['Year'] = year;



							



							
				
						if (temp.Type == null || temp.Type == "L") {// lecture slot

						if( temp.StaffEID == EID ){

							
							console.re.log("Match found ");
							temp['Div'] = div;
							console.re.log(temp);
							
							switch(day){
							
							
								case 'Monday' : mon.push(temp);
								break;
								
								case 'Tuesday' : tues.push(temp);
								console.re.log("In tue ");
								break;
								
								case 'Wednesday' : wed.push(temp);
								console.re.log("In wed ");
								
								break;
						
								case 'Thursday' : thrus.push(temp);
								break;
								
								case 'Friday' : fri.push(temp);
								break;
								
								case 'Saturday' : sat.push(temp);
								break;
								
							}
							
							
							
							
							
							
						}

							

					}if (temp.Type != null && temp.Type == "P"){ //practical slot

						var batches = temp.Batches;
						for (var i = 0 ;  i < batches.length ; i++) {

						 	var batch = batches[i];

						 		if( batch.StaffEID == EID ){

						 			batch['Year'] = year;

						 			console.re.log("Match found ");
									batch['Div'] = batch.Batch;
									console.re.log(temp);
							
							switch(day){
							
							
								case 'Monday' : mon.push(batch);
								break;
								
								case 'Tuesday' : tues.push(batch);
								console.re.log("In tue ");
								break;
								
								case 'Wednesday' : wed.push(batch);
								console.re.log("In wed ");
								
								break;
						
								case 'Thursday' : thrus.push(batch);
								break;
								
								case 'Friday' : fri.push(batch);
								break;
								
								case 'Saturday' : sat.push(batch);
								break;
								
							}


						 		}


						 } 



					}else{ // slot where type is not mentioned





							}

				
						console.re.log("Temp is "+JSON.stringify(temp)+"staffID is "+temp.StaffEID + "  EID is "+EID);
						
					}
					console.re.log(tokens[i]);
			
				}	
							object["Monday"] = mon;
							object["Tuesday"] = tues;
							object["Wednesday"] = wed;
							object["Thursday"] = thrus;
							object["Friday"] = fri;
							object["Saturday"] = sat;
							console.re.log("Final object is "+object);
							var str = JSON.stringify(object);
							console.re.log("Final object is "+str);
							socket.emit('facultyFetchTTResult', object);
							console.re.log("Socket emitted...");
			}
		});
		clients--;
		console.re.log("Client disconnected.... and clients are "+clients);
			
		
		// 
		
		

}
