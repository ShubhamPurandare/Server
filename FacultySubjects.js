


exports.facultySubjects = function(clients, socket, db , jsonobj){
var SubjectsColl = db.collection("Subjects");
	

		

console.log("In facultySubjects method");
			var data = JSON.parse(jsonobj); //convert into json obj
			//var data = jsonobj;
				//	console.log("data is "+JSON.stringify(data));
			console.log(data );
			console.log(jsonobj);
			var eid = data.EID;
			var branch = data.Branch;
			var sem = data.Sem;
			var cr = data.CurrentYear;
			var facultySubjColl = db.collection("FacultyAllocation");
			var hashmap = db.collection("FacultyAllocationHashMap");
			console.log("EID "+eid + " branch "+branch + " Sem "+sem + "CurrentYear is "+cr);
			var TE = [];
			var SE = [];
			var BE = [];
			var finalObj = {};
			facultySubjColl.find().forEach(  function(doc){
	
	
				//console.log(doc._id);
				var id = doc._id;
				if(id.indexOf(branch)>=0  && id.indexOf(sem)>=0  && id.indexOf(cr)>=0){
					console.log("Valid Document");
					var object = doc.object;
					//console.log(object);
			
					for(var i=0 ; i<object.length; i++){
						var temp = object[i];
						console.log("before matching"+eid);
						if( temp.FacultyCode == eid   ){
				
							console.log("Match found ");
							console.log(temp);
							var CurrYear = id.substr(-4);
							var main = id.substr(-5);
							var div = main.substr(0 , 1);
							var one = id.substr(-11);
							var year = one.substr(0,2);
												
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
						
							
							
				
						}else{
							console.log("Match not found ");
				
				
						}
					}
			
			
				}else{
					console.log("Not a valid document");
				}
				console.log("Final object is"+JSON.stringify(finalObj));
						socket.emit("FacultySubjResult" , finalObj);

						// load this data in facultyAvailabillty

						hashmap.find({_id : branch+cr }).toArray(function(err, res){

							if(err){

								throw err;}


							if (res.length !=0) {

								// update
								var obj = {};
								console.log(eid);
								 obj['eid']=finalObj;
								
								hashmap.update({_id:branch+cr},{$set:obj});
							}else{
								//insert

								hashmap.insert({ _id : branch+cr  });
							}

						});

				
				//lookForStudents(finalObj, SubjectsColl);
							
	
			});
			
			
			
			
	
		




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
				console.log("Subject code is "+subCode + " And div is "+div);	
				
					SubjectsColl.aggregate([{$match:{ "_id" : subCode }  },{ $unwind: "$students"  },{ $lookup : { from: 							"basicUserDetails", localField: 							"students",foreignField:"_id", as:"matched"  }}   ]).toArray( function(error , result){
			
			//console.log(result);
			
			for(var i=0; i<result.length; i++){
		 	
		 		var obj = result[i];
		 		//console.log(obj);
		 		 var matched = obj.matched;
		 		//console.log(matched);
		 		if(matched.length >0){
		 			var obj1 = matched[0];
		 			if(obj1.div == div){
		 				console.log("yessssssssssssss");
		 				validStudents.push(obj1._id);
		 				console.log("Valid students are "+validStudents);
			
		 				
		 			}
		 		}
		 		
		 		 
		 	}
		 	console.log("Loop "+j+" ended..");
			
			obj['StudentsList'] = validStudents;
			console.log("Valid students are "+validStudents);
			j++;
			
			validStudents = [];
			
			
			
			});
			
		 
			}
		
		}
		
	
	}



