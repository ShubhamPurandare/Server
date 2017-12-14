
var mongo = require('mongodb').MongoClient;
var fs = require('fs');
var sizeof = require('object-sizeof');


mongo.connect('mongodb://BornCoders:radarockssmp1@ds111529.mlab.com:11529/viit' , function(err , db){

	if(err){
		throw err;
		console.log("Error connecting to mlab ...");
	}else{
	
		var users = db.collection("Users");
		users.aggregate({  
		
			$group:{
			
				_id : "$branch",
				total : { $sum : 1  }
			}
		
		}).toArray(function(err,data){
		
			console.log(JSON.stringify(data));
		
		});
		


	}
});
