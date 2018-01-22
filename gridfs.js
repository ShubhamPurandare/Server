'use strict';
// dependencies
var mongo = require('mongodb');
var Grid = require('gridfs');
		

mongo.MongoClient.connect('mongodb://BornCoders:radarockssmp1@ds111529.mlab.com:11529/viit' , function(err , db){

	if(err){
		throw err;
		console.log("Error connecting to mlab ...");
	}else{

		
		console.log(" connected to mlab ...");
		
		var gfs = Grid(db, mongo);
		var source = './android.png';
  
		
		 gfs.fromFile({filename: 'android.png'}, source, function (err, file) {
		    console.log('saved %s to GridFS file %s', source, file._id);
		    gfs.readFile({_id: file._id}, function (err, data) {
		      console.log('read file %s: %s', file._id, data.toString());
		    });
		  });


	}

});
