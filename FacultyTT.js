
exports.facultyTT = function(clients, socket , db , jsonobj , TTFacultyColl){


	console.log("IN fetchFacultyTT");
			var data = JSON.parse(jsonobj);
			console.log("Data is "+data);
			var arrayOfTokens = data.ArrayOftokens;
			console.log("Tokens are :"+arrayOfTokens);
			
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
			//console.log(tokens);
			
			
		
		
			TTFacultyColl.find().forEach(  function(doc){
		
			//console.log(doc);
			var id = doc._id;
			if(arrayOfTokens.indexOf(id) != -1    ){
			
				console.log("Valid Document");
				for (var i=0; i< tokens.length ; i++){
				console.log("length "+tokens.length);
								
					console.log(tokens[i]);
					var day = tokens[i]
					var week = doc[day];
					
					
					
					
					console.log(week.length);
					for(var j=0 ; j<week.length; j++){
						var temp = week[j];
						
						console.log("Temp is "+JSON.stringify(temp)+"staffID is "+temp.StaffEID + "  EID is "+EID);
						if( temp.StaffEID == EID ){

				
							console.log("Match found ");
							var div = id.substr(-1);
							var one = id.substr(-7 );
							var year = one.substr(0, 2);
							temp['Year'] = year;
							temp['Div'] = div;
							console.log(temp);
							
							switch(day){
							
							
								case 'Monday' : mon.push(temp);
								break;
								
								case 'Tuesday' : tues.push(temp);
								console.log("In tue ");
								break;
								
								case 'Wednesday' : wed.push(temp);
								console.log("In wed ");
								
								break;
						
								case 'Thursday' : thrus.push(temp);
								break;
								
								case 'Friday' : fri.push(temp);
								break;
								
								case 'Saturday' : sat.push(temp);
								break;
								
							}
							
							
							
							
							
							
						}
					}
					console.log(tokens[i]);
			
				}	
							object["Monday"] = mon;
							object["Tuesday"] = tues;
							object["Wednesday"] = wed;
							object["Thursday"] = thrus;
							object["Friday"] = fri;
							object["Saturday"] = sat;
							console.log("Final object is "+object);
							var str = JSON.stringify(object);
							console.log("Final object is "+str);
							socket.emit('facultyFetchTTResult', object);
							console.log("Socket emitted...");
			}
		});
		clients--;
		console.log("Client disconnected.... and clients are "+clients);
			
		
		// 
		
		

}
