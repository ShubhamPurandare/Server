

var mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var client = require('socket.io')();
var clients = 0;
var days = new Array("Monday","Tuesday", "Wednesday","Thursday","Friday", "Saturday");
var tokens = new Array("8.00" , "9.00" , "10.15" , "11.15" , "13.15", "14.15", "15.15","15.30" , "16.30", "17.30" );
var hashmap = {};



mongo.connect('mongodb://BornCoders:radarockssmp1@ds111529.mlab.com:11529/viit' , function(err , db){

	if(err){
		throw err;
		console.log("Error connecting to mlab ...");
	}else{
		//var db = database.db("viit");
	

			console.log("Connected to mlab ...");
			var TimeTable = db.collection("Load_Time_Table");
			var users = db.collection("basicUserDetails");
			var freemap = db.collection("FreeFacs");
			var sem = "Sem2";
			var dept = "Computer";
			var year = "BE";
			var div = "C";
			var cr = "2018";
			var query = {_id : /^E/};
			var arrOfEID = [];

	//Clone Function
			var clone = function(hashmap,k)
			{

				if (hashmap[k] != null) {
					return JSON.parse(JSON.stringify(hashmap[k]));
			
				}else{
					return null;
				}

			}



			var id = dept+sem+cr; 

			var updateFreeFacHashmap = function(map){


					freemap.find({
							_id : id

					}).toArray(function(err , res){

							if (err) {throw err;}

							if (res.length == 0) {
								// insert

								freemap.insert({  _id : id ,  map : ""  });
								console.log("Inserted");

							}else{
								console.log("result is "+JSON.stringify(res));

							}

							var obj = {};
							var obj1 = JSON.stringify(hashmap);
							obj["map"] = hashmap;
							console.log(obj1);
							console.log(id);
							
										//	c.update({"_id":grNumber} , {$set:  infoObj }  );

							freemap.update(  {_id : id}  , {  $set : { map : obj1 } }  );
							// update


					});


			}



			
			var loadHashMap = function(){




				var rd = "/"+dept+"/";
				var rsem = "/"+sem+"/";
				var ryear = "/2018/";


				console.log(rd);

				TimeTable.find(
				{ $and:[
						 {_id : /Computer/},
						 {_id : /Sem2/},
						 {_id : /2018/} 
					   ]}
				).toArray(function(err , res){

					if (err) {throw err;}

					console.log("res is "+res);

					// list of TT objs of the whole dept 

					for (var i = 0; i < res.length; i++) {
						 	var obj = res[i];

						 	// iterate through each day's object.

						 	for (var j = 0; j < days.length; j++) {
						 			var day = days[j];
						 			var dayArray = obj[day];

						 			for (var k = 0; k < dayArray.length; k++) {
						 					var dayObject = dayArray[k];
						 					// create the hashmap now !
						 					var array=[];
						 					
						 					var eid = dayObject.StaffEID;
						 					var time = dayObject.Time;
						 					var key = day+time;
						 					array = clone(hashmap,key);

						 					


						 					console.log("Key is "+key + "  eid is "+eid);
						 					console.log("Earlier hashmap is "+array);

						 					if (array != null) {
						 						var index = array.indexOf(eid);
						 						if (index != -1) {
						 							array.splice(index , 1);
							 						console.log("Spliced "+index)
	
						 						}
						 						
						 					}

						 					hashmap[key] = array;
										//	console.log("Now hashmap is "+array);

						 			}



						 	}




					}



					console.log("***** DONE *****");
				//	console.log("Now the hashmap is "+JSON.stringify(hashmap));
					updateFreeFacHashmap(hashmap );





			});
			}



		





			//2.
			var initializeFacs = function(){

				for (var i = 0; i < days.length; i++) {
						for (var j = 0; j < tokens.length; j++) {
					
								//var t = days[i]+tokens[j];
								//console.log(t);
								hashmap[days[i]+tokens[j]] = arrOfEID;

						}
						
					}

					console.log("HashMap is "+JSON.stringify(hashmap));
					loadHashMap();
				/*	var j = "Tuesday9.00";
					

					var k = "Monday8.00";
					 var key = clone(hashmap,k);
					 console.log(key);
					//hashmap[k] = "hey";
					console.log(key);
					key.splice(0,1);
					console.log("Key after splice is "+key);
					hashmap[k] = key;
					console.log("hashmap after splice is "+JSON.stringify(hashmap));
			
					
				
				
					key = hashmap[j];
					console.log(key);
//					console.log(hashmap[j]);*/
				



			}

			//1.
			users.find(
						{
					 $and:[
						 {"branch":"Computer"},
						 {_id : /^E/} 
					      ]}

				).toArray(function(err , res){

				if (err) {throw err;}

				if (res.length > 0) {

					for (var i = 0; i < res.length; i++) {
						var fac = res[i];
						arrOfEID.push(fac._id);
					}

					console.log("EID fetching done !");
					initializeFacs();
				}

			});











	}
});	