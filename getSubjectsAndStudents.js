'use strict';
// dependencies
var mongo = require('mongodb').MongoClient;
var consolere = require('console-remote-client').connect('console.re','80','VIConnectChannel');

		var eid = "E103";
		var branch = "Computer";
		var sem = "Sem2";
		console.re.log("EID "+eid + " branch "+branch + " Sem "+sem);
		var TE = [];
		var SE = [];
		var BE = [];
		var finalObj = {};
			
			

		function getStudents(SubjectsColl , mainArr ,newObject , finalObj ){
		
			console.re.log("In get students method....mainarr = "+mainArr + " codes are "+JSON.stringify(newObject));
			SubjectsColl.aggregate([{$match:{ "_id" : { $in : mainArr } }  },{ $unwind: "$students"  },{ $lookup : { from: 		
								"basicUserDetails", localField: "students",foreignField:"_id", as:"matched"  }}]).toArray( function(error , result){
			
					console.re.log("Result is "+JSON.stringify(result));
			
					var validStudents = [];
					var ob1 = {};
			
					var res =0;
					while(res < result.length){
				 	
				 		var obj = result[res];
				 		
						    
				 			
				 		
				 		//console.re.log(obj);
				 		 var matched = obj.matched;
				 		//console.re.log(matched);
				 		if(matched.length >0){
				 			var obj1 = matched[0];
				 			console.re.log("Subject code is "+mainArr[res]   )  ;
				 			var div = getDivFromArray(newObject ,mainArr[res] );
				 			console.re.log("Div is "+div);
				 			if(obj1.div == div){
				 				console.re.log("yessssssssssssss");
				 				validStudents.push(obj1._id);
				 				
				 				var year = getYearFromArray(newObject   ,mainArr[res]);
				 				var yearObj = finalObj[year];
				 				console.re.log("Year object is "+print(yearObj));
				 				var mainObj = getCorresObj(yearObj, finalObj ,mainArr[res], div );
				 				console.re.log("Main object is "+print(mainObj));
				 				
				 				mainObj['Students'] = validStudents;
				 				console.re.log("Main object is "+print(mainObj));
				 				
				 				
				 				
				 				
				 				
			//	 				console.re.log("Valid students are "+JSON.stringify(ob1) + "Subject code is "+f[res]);
			
				 				
				 			}
				 		}
				 		res++;
				 		 
				 	}
				 	
				 	console.re.log("Final updated object is "+print(finalObj));
				
			
			});
			
		
		
		}
		
		
		
		
		
		
		
		function getCorresObj(yearObj , finalObj ,code, div ){
		
			for(var ob in yearObj){
				var object = yearObj[ob];
				if(object.SubjCode == code && object.Div == div){
					return object;
				}
			}
		}
		
		function print(str){return JSON.stringify(str)}
		
		function getYearFromArray(mainArr , code){
		
			for(var ob in mainArr){
				var object = mainArr[ob];
				if(object.SubjCode == code){
					return object.Year;
				}
			}
		}
			
		function getDivFromArray(mainArr , code){
				
			for(var ob in mainArr){
				var object = mainArr[ob];
				if(object.SubjCode == code){
					return object.Div;
				}
			}
		
		
		}
			
		function getCodes(newObj){
		
			return newObj.map(function(fav){return fav.SubjCode});
			
		}
			
			
		function transformObj(finalObj){
			console.re.log("In transform function");
			var subjectCodes = [];
			var arr = new Array("SE" , "TE" , "BE");
		
			var i = 0;
			while(i != arr.length){
		
				var token = arr[i];
				var arrOfYear = finalObj[token];
				var count = arrOfYear.length;
				for(var j=0 ; j<count ; j++){
					var obj = arrOfYear[j];
					var subCode = obj['SubjCode'];
					var div = obj['Div']
					var ob1 = {};
					ob1['SubjCode'] =subCode ;
					ob1['Year'] = arr[i];
					ob1['Div'] = div; // "S004" : "SE"
					subjectCodes.push(ob1);
					//console.re.log("Subject codes contain "+subjectCodes);
		
				}
				i++;
			
			}
			console.re.log("New  object is"+JSON.stringify(subjectCodes));
			return subjectCodes;
			
		
					
		}
			


		

mongo.connect('mongodb://BornCoders:radarockssmp1@ds111529.mlab.com:11529/viit' , function(err , db){

	if(err){
		throw err;
		console.re.log("Error connecting to mlab ...");
	}else{
			console.re.log("Connected to mlab ...");

			// helper functions




			// end of helper functions











	var SubjectsColl = db.collection("Subjects");
	var facultySubjColl = db.collection("FacultyAllocation");

	
			console.re.log("In facultySubjects method");
			
			
			facultySubjColl.find().toArray( function(error , result){
			
				if(error)throw error;
				
				console.re.log("Total documents are "+result.length);
				
				var count =0;
				while(count !=result.length ){
				
					var doc = result[count];
					var id = doc._id;
					if(id.indexOf(branch)>=0  && id.indexOf(sem)>=0){
						console.re.log("Valid Document");
						var object = doc.object;
						console.re.log(object);
						for(var i=0 ; i<object.length; i++){
							var temp = object[i];
							if( temp.FacultyCode == eid   ){
				
								console.re.log("Match found ");
								console.re.log(temp);
								var div = id.substr(-1);
								var one = id.substr(-7 );
								var year = one.substr(0, 2);
					
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
					
					count++;
				}
					console.re.log("Final object is"+JSON.stringify(finalObj));
					var newObject = transformObj(finalObj);
					//console.re.log("New  object is"+JSON.stringify(newObject));
					var mainArr = getCodes(newObject);
					console.re.log(JSON.stringify(mainArr));
					getStudents(SubjectsColl ,mainArr ,newObject , finalObj );
		
					
					
					console.re.log("****************************** FIRST TASK HAS ENDED *******************************");
					//lookForStudents(finalObj , SubjectsColl);
			
				
				
			
			});
			
			
			
			
			


	
	
	
	}// else
	
	
	
}); // mongod connect



