


exports.facultySubjects = function(clients, facultySubjColl, socket, db , jsonobj){


		

console.log("In facultySubjects method");
			var data = JSON.parse(jsonobj); //convert into json obj
			var eid = data.EID;
			var branch = data.Branch;
			var sem = data.Sem;
			console.log("EID "+eid + " branch "+branch + " Sem "+sem);
			var TE = [];
			var SE = [];
			var BE = [];
			var finalObj = {};
			facultySubjColl.find().forEach(  function(doc){
	
	
				//console.log(doc._id);
				var id = doc._id;
				if(id.indexOf(branch)>=0  && id.indexOf(sem)>=0){
					console.log("Valid Document");
					var object = doc.object;
					//console.log(object);
			
					for(var i=0 ; i<object.length; i++){
						var temp = object[i];
						if( temp.FacultyCode == eid   ){
				
							console.log("Match found ");
							console.log(temp);
							var div = id.substr(-1);
							var one = id.substr(-7 );
							var year = one.substr(0, 2);
					
						//	console.log("Subject is "+temp.Subject);
							var obj1 = {}
							obj1["Subject"] = temp.Subject;
							obj1["Div"] = div;
							obj1["SubjCode"] = temp.SubjectCode;
							 
					
							switch(year){
							case 'SE' :  SE.push(obj1); 
									console.log("Added in SE");
								break;
							case 'TE' :  TE.push(obj1);
					
									console.log("Added in TE");
								break;
							case 'BE' :  BE.push(obj1); 
					
									console.log("Added in BE");
								break;
								}
						
							finalObj["SE"] = SE;
							finalObj["TE"] = TE;
							finalObj["BE"] = BE;
						
							console.log("Final object is"+JSON.stringify(finalObj));
							socket.emit("FacultySubjResult" , finalObj);
				
				
						}else{
							console.log("Match not found ");
				
				
						}
					}
			
			
				}else{
					console.log("Not a valid document");
				}
		
	
			});
			clients--;
			console.log("Client disconnected.... and clients are "+clients);
			
				
		
		




}



