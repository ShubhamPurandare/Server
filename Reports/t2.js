
var mongo = require('mongodb').MongoClient;
var fs = require('fs');
var sizeof = require('object-sizeof');
var j2xls = require('json2xls-xml')({ pretty : true });
 


mongo.connect('mongodb://BornCoders:radarockssmp1@ds111529.mlab.com:11529/viit' , function(err , db){

	if(err){
		throw err;
		console.log("Error connecting to mlab ...");
	}else{
	
	
	var getKeys = function(colName){
			var k1 = Object.keys(colName);
					
	}
		
	
		var users = db.collection("Users");
		var basicObjKeys ;
		var arr=[];
		
		var c = db.collection("personalDetails"); // replace later
						
		c.find().toArray(function(err,data){ // remove latency
						if(err)throw err;
							var d = data[0];
							var key = Object.keys(d);
							basicObjKeys = key; // keys found 
							console.log("basic user deatils keys can now be used..");
							
						
						
		});
		
		
		
		
		 users.aggregate([{ $lookup : { from: "personalDetails", localField: 							"_id",foreignField:"_id", as:"matched"  }}   ]).toArray( function(error , result){
			
					console.log(result);
					
					
					var count =0;
					while(count != result.length){
					
					var temp = result[count];
					var matchedObj = temp.matched;
					delete temp.matched;
					var finalMatch = matchedObj[0];
					var r1 = {};
					var t2 = {};
					for(var key in temp) r1[key] = temp[key];
					if(finalMatch == null){
						console.log("NULLL VALUE DETECTED");
					for(var i in basicObjKeys){
							console.log(basicObjKeys[i]);
							var j = basicObjKeys[i];
							if(j != "_id" )
							t2[j] = "";
							
						
					}
						console.log("Newly created object is "+JSON.stringify(t2));
						for(var key in t2) r1[key] = t2[key];
						
					}else{
						console.log("NOT NULL");
					
						for(var key in finalMatch) r1[key] = finalMatch[key];
						
					}
					
						arr.push(r1);
						fs.writeFileSync('data2.xls', j2xls(arr), 'binary');
			
						
					
						count++;
					
					
					}
					
					
				/*	var temp = result[0];
					var matchedObj = temp.matched;
					delete temp.matched;
					var finalMatch = matchedObj[0];
					var r1 = {};
					for(var key in temp) r1[key] = temp[key];
					
							
					if(finalMatch == null){
						console.log("NULLL VALUE DETECTED");
						var t2 = {};
						for(var i in basicObjKeys){ 
							console.log(basicObjKeys[i]);
							var j = basicObjKeys[i];
							if(j != "_id" )
							t2[j] = "";
						}
						console.log("Newly created object is "+JSON.stringify(t2));
						for(var key in t2) r1[key] = t2[key];
						arr.push(r1);
						fs.writeFileSync('data2.xls', j2xls(arr), 'binary');
			
							
					
						
						
					}else{
						for(var key in finalMatch) r1[key] = finalMatch[key];
						//temp = temp.merge(finalMatch);
						arr.push(r1);
						
						fs.writeFileSync('data2.xls', j2xls(arr), 'binary');
						console.log("Array is "+JSON.stringify(arr));
			
					}
						
						
						
						
				*/	
					
				});
		
		
		/*
		users.find().toArray(function(error , res){
		
			if(error)throw error;
			
			var count =0;
			while(count != res.length){
			
				console.log("Loop "+count);
				var obj = res[count];
				
				var id = obj._id;
				
			
				
				
					count++;
				
			}
			
			
			//fs.writeFileSync('data2.xls', j2xls(arr), 'binary');
			console.log("Writing data here");
		
		});
		*/
		
		
			

	}
});
