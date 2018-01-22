
exports.stats = function(db , socket , jsonObj){

	var collName = null;
	var arrOfQueries= [];
	var collsUsed = [];
	var fields = [];
	fields.push("_id");
	//var json = JSON.parse(jsonObj);
	// 1. display
	console.log(JSON.stringify(jsonObj));
	
	var createObj = function(coll ){
				
			var o1 = {
			$lookup :{
			from : coll,
			localField : "_id",
			foreignField : "_id",		
			as : coll,		
				}
			};
			
			return o1;
	}
	
	
	var createMatch = function(obj){
	
		console.log("obj is  "+JSON.stringify(obj));
		var key = obj.Field;
		var val = obj.Value;
		console.log("key is  "+key);
		
		console.log("val is  "+val);
	
		var o ={};
			
		o[key] = val;
		var o1 = {
			$match : o			
		};
		return o1;
	
	}
	
	
	// do matches
	var fieldsToSend = jsonObj.Field;
	var matchConds = [];
	matchConds = jsonObj.Matched;
	//console.log("Fields are "+JSON.stringify(fieldsToSend));
	//console.log("Matched condion is "+JSON.stringify(matchConds));
	if(matchConds != null)
	for(var o in matchConds){
		//console.log("Condition is "+JSON.stringify());
		var object = matchConds[o]; // object which contains forst match condition
		collName = object.CollName;
		var conditions = object.array;
		 for(var ob in conditions){
		 	var actualCond = conditions[ob];
		 	var obCond = createMatch(actualCond);
		 	arrOfQueries.push(obCond);
		 	
		 }
		
	}
	
	
	console.log("Condition is "+JSON.stringify(arrOfQueries));
		
	// do lookups
	 for(var ob in fieldsToSend){
	 	var ob1 = fieldsToSend[ob];
	 	var coll = ob1.collName;
	 	var fieldArray = ob1.array;
	 	var objToPut = createObj(coll);
	 	arrOfQueries.push(objToPut);
	 	collsUsed.push(coll);
	 	for(var o in fieldArray){
	 		fields.push(fieldArray[o]);
	 	}
	 	
	 }
	 
	 
	 var workOnTheresult = function(result){
	 
	 	var finalArr = [];
	 	// logic
	 	
	 	for(var o in result){
	 		var item = result[o];
	 		// this is the single result now
	 		
	 			
	 			var r1= {};
				var d=0;
				while(d != collsUsed.length){
			
					var name = collsUsed[d];
					//console.log(name);
					if(item[name] != null){
						var t = item[name];
						//console.log("item name is "+JSON.stringify(item[name]));
						
						var temp = t[0];
						//console.log("Temp is "+JSON.stringify(temp));
						//console.log("Temp object is "+JSON.stringify(temp));
						if(temp != null  ){
						
							for(var key in temp) r1[key] = temp[key];
						
						//	console.log("R1 is "+JSON.stringify(r1));
						}
							delete item[name];
						
					
					}else{
						delete item[name];
					}
				
					d++;
					//console.log("ITEM NOW IS "+JSON.stringify(item));
					
				}
				for(var key in item) r1[key] = item[key];
				//console.log("Modified object is "+JSON.stringify(r1));
				finalArr.push(r1);
			
	 		
	 		
	 		
	 	}
	 	
	 	return finalArr;
	 
	 
	 }
	 
	 
	console.log("Condition is "+JSON.stringify(arrOfQueries));
	console.log("Collections used are  "+collsUsed);
	
	
	// run the aggregate query
	if(collName != null){
		var collection = db.collection(collName);
	}else{
		var collection = db.collection("Users");
		
	}
		var aadd = {
      $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$personalDetails", 0 ] }, "$$ROOT" ] } }
   };
   var d = 
   { $project: { fromItems: 0 } }; 
   
   //arrOfQueries.push(aadd);
   //arrOfQueries.push(d);
	
		collection.aggregate(arrOfQueries).toArray(function(err, result){
		
			if(err)throw err;
			
			console.log(JSON.stringify(result));
			// make a single json object of all 
			var modifiedArray =  workOnTheresult(result);
			console.log("FINAL ARRAY IS  "+JSON.stringify(modifiedArray));
			
			console.log("FIELDS TO SEND ARE "+fields);
			var arrayToSend = [];
			
			for(var d in modifiedArray ){
				var obj = modifiedArray[d];
				var tempObj = {};
				
				for(var f in fields){
					var field = fields[f];
					if(obj[field]!= null){
					
						console.log("THE OBJECT CONTAINS "+field);
						tempObj[field] = obj[field];
					
					}else{
						
						console.log("THE OBJECT DOES NOT CONTAINS "+field);
						tempObj[field] = "";
					
					}
					
				
			
				}
				console.log("The Temp object is "+JSON.stringify(tempObj));
				arrayToSend.push(tempObj);
				
			
			}
			
			
				console.log("The final array is  "+JSON.stringify(arrayToSend));
				socket.emit("StatsResults" ,arrayToSend );
			
			
			
			
			
		
		});
		
	
	
	

}
