
var mongo = require('mongodb').MongoClient;
var fs = require('fs');
var sizeof = require('object-sizeof');


mongo.connect('mongodb://BornCoders:radarockssmp1@ds111529.mlab.com:11529/viit' , function(err , db){

	if(err){
		throw err;
		console.log("Error connecting to mlab ...");
	}else{
		

		console.log("Connected to mlab ...");

		var users = db.collection("Users");
		var personalDetails = db.collection("personalDetails");
		var academicDetails = db.collection("academicDetails");
		var basicDetails = db.collection("basicUserDetails");
		var residentialInfo = db.collection("residentialInfo");
		var parentInfo = db.collection("parentInfo");
		var personaldata, academicdata, userdata , basicdata , resdata , parentData, count=0 ;
		var finalData;
		var arr;
		
		
		users.find().toArray(function(err,data){
			
			if(err){
					throw error;
				}else{
				
				console.log("In users find method ");
				
				userdata = data;
				
				incrCount();
			}
		});
		
		
		 personalDetails.find().toArray(function(err,data){
			
			if(err){
					throw error;
				}else{
				console.log("In personal find method ");
				
				
				personaldata = data;
				incrCount();
			}
		});
		
		
		
		
		academicDetails.find().toArray(function(err,data){
			
			if(err){
					throw error;
				}else{
				console.log("In aca find method ");
				
				academicdata = data;
				incrCount();
				
			}
		});
		
		

		basicDetails.find().toArray(function(err,data){
			
			if(err){
					throw error;
				}else{
				console.log("In basic find method ");
				
				
				basicdata = data;
				incrCount();
				
			}
		});
		
		
		
		residentialInfo.find().toArray(function(err,data){
			
			if(err){
					throw error;
				}else{
				console.log("In res find method ");
				
				resdata = data;
				incrCount();
				
			}
		});
		
		parentInfo.find().toArray(function(err,data){
			
			if(err){
					throw error;
				}else{
				console.log("In parennt find method ");
				
				
				parentData = data;
				incrCount();
				
			}
		});
		
		var incrCount = function( ){
		
			if(++count == 6){
			
				console.log("sagala zala maza ");
				arr = [personaldata, academicdata, userdata , basicdata , resdata , parentData];
				
				prenext();
				
			}
		
		}
		
		var prenext = function()
		{
				for (var i =0; i< arr.length ; i++){
				
				var c = arr[i];
				var k = c[0];
				var k1 = Object.keys(k);
				console.log(k1);
					for(var j = 0; j < k1.length; j++){

					 finalData+=k1[j]+'\t';

					}	
			
				}
				
				
				 finalData+='\n';
				 fs.appendFile('data1.xls', finalData, 'binary' ,function(error){
					if(error){
						console.log("Error");
					
					}
				
					console.log("Done");
					next();
					
				});

				
				
		}
		
		
		var next = function(){
		
			var obj = arr[0];
			
			for (var i =0; i< obj.length ; i++){
			
				var o = obj[i];
				var id = o._id;
				for(var j = 0; j < k1.length; j++){

					 finalData+=k1[j]+'\t';

				}
				
				
				// start searching for this user in other collections
				
			
			}
		
		}
		
		
		
		
			
		
}
});
