


exports.facultySubjects = function(clients, facultySubjColl, socket, db , jsonobj){
var SubjectsColl = db.collection("Subjects");
	

		

console.re.log("In facultySubjects method");
			var data = JSON.parse(jsonobj); //convert into json obj
			console.log("data is "+JSON.stringify(data));
			var eid = data.EID;
			var branch = data.Branch;
			var sem = data.Sem;
			var cr = data.CurrentYear;
			console.re.log("EID "+eid + " branch "+branch + " Sem "+sem + "CurrentYear is "+cr);
			var TE = [];
			var SE = [];
			var BE = [];
			var finalObj = {};
			facultySubjColl.find().forEach(  function(doc){
	
	
				//console.re.log(doc._id);
				var id = doc._id;
				if(id.indexOf(branch)>=0  && id.indexOf(sem)>=0  && id.indexOf(cr)>=0){
					console.re.log("Valid Document");
					var object = doc.object;
					//console.re.log(object);
			
					for(var i=0 ; i<object.length; i++){
						var temp = object[i];
						if( temp.FacultyCode == eid   ){
				
							console.re.log("Match found ");
							console.re.log(temp);
							var CurrYear = id.substr(-4);
							var main = id.substr(-5);
							var div = main.substr(0 , 1);
							var one = id.substr(-11);
							var year = one.substr(0,2);
												
						//	console.re.log("Subject is "+temp.Subject);
							var obj1 = {}
							obj1["Subject"] = temp.Subject;
							obj1["Div"] = div;
							obj1["SubjCode"] = temp.SubjectCode;
							 
					
							switch(year){
							case 'SE' :  SE.push(obj1); 
									console.re.log("Added in SE");
								break;
							case 'TE' :  TE.push(obj1);
					
									console.re.log("Added in TE");
								break;
							case 'BE' :  BE.push(obj1); 
					
									console.re.log("Added in BE");
								break;
								}
						
							finalObj["SE"] = SE;
							finalObj["TE"] = TE;
							finalObj["BE"] = BE;
						
							
							
				
						}else{
							console.re.log("Match not found ");
				
				
						}
					}
			
			
				}else{
					console.re.log("Not a valid document");
				}
				console.re.log("Final object is"+JSON.stringify(finalObj));
							socket.emit("FacultySubjResult" , finalObj);
				
				//lookForStudents(finalObj, SubjectsColl);
							
	
			});
			
			
			
			clients--;
			console.re.log("Client disconnected.... and clients are "+clients);
			
				
		
	
		




}

function lookForStudents(finalObj , SubjectsColl){
	
		
	var validStudents = [];
		// fetch concerned students.
		
		var arr = new Array("SE" , "TE" , "BE");
		
		for(var i=0; i< arr.length ; i++){
		
			var token = arr[i];
			var arrOfYear = finalObj[token];
			var count = arrOfYear.length;
			var j=0;
			while(j<count){
				
				var obj = arrOfYear[j];
				var subCode = obj['SubjCode'];
				var div = obj['Div'];
				console.re.log("Subject code is "+subCode + " And div is "+div);	
				
					SubjectsColl.aggregate([{$match:{ "_id" : subCode }  },{ $unwind: "$students"  },{ $lookup : { from: 							"basicUserDetails", localField: 							"students",foreignField:"_id", as:"matched"  }}   ]).toArray( function(error , result){
			
			//console.re.log(result);
			
			for(var i=0; i<result.length; i++){
		 	
		 		var obj = result[i];
		 		//console.re.log(obj);
		 		 var matched = obj.matched;
		 		//console.re.log(matched);
		 		if(matched.length >0){
		 			var obj1 = matched[0];
		 			if(obj1.div == div){
		 				console.re.log("yessssssssssssss");
		 				validStudents.push(obj1._id);
		 				console.re.log("Valid students are "+validStudents);
			
		 				
		 			}
		 		}
		 		
		 		 
		 	}
		 	console.re.log("Loop "+j+" ended..");
			
			obj['StudentsList'] = validStudents;
			console.re.log("Valid students are "+validStudents);
			j++;
			
			validStudents = [];
			
			
			
			});
			
		 
			}
		
		}
		
	
	}



