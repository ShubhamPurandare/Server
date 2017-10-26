'use strict';
// dependencies
var port     = process.env.PORT || 8083;
var mongo = require('mongodb').MongoClient;
var client = require('socket.io')();
var clients = 0;
var rooms = [];
var nodemailer = require("nodemailer");
var facultySubj = require("./FacultySubjects");
var facultyTT = require("./FacultyTT");
var loginModule = require("./Login");
var registerModule = require("./Register");
var getAllDataModule = require("./GetAllData");
var registerStudentModule = require("./RegisterStudent");
var allInfoModule = require("./AllInfo");
var updates = {};


mongo.connect('mongodb://BornCoders:radarockssmp1@ds111529.mlab.com:11529/viit' , function(err , db){

	if(err){
		throw err;
		console.log("Error connecting to mlab ...");
	}else{
		

		console.log("Connected to mlab ...");
		var collection = db.collection("Chat"); // create and define all collections here ..
		var profile = db.collection("profile");
		var users = db.collection("Users");
		var personalDetails = db.collection("personalDetails");
		var academicDetails = db.collection("academicDetails");
		var basicDetails = db.collection("basicDetails");
		var residentialInfo = db.collection("residentialInfo");
		var parentInfo = db.collection("parentInfo");
		var chatSection = db.collection("chatSection");
		var attendance = db.collection("attendance");
		var Certificates = db.collection("Certificates");
		var TimeTable = db.collection("Load_Time_Table");
		var facultySubjColl = db.collection("FacultyAllocation");
		var TTFacultyColl = db.collection("Load_Time_Table");
		var SubjectsColl = db.collection("Subjects");
		
		
		var allFieldsString = ["personalDetails" , "academicDetails","basicDetails", "residentialInfo", "parentInfo"]
		var allFields = [personalDetails, academicDetails, basicDetails, residentialInfo, parentInfo];
		//console.log(allFieldsString);
		
		
		client.on('disconnect' , function(socket){
			clients--;
			console.log("Client disconnected.... number of clients is "+ clients);
		});
					

		
		client.on('connection' , function(socket ){
		clients++;
		console.log("Client "+clients+ " Connected.....");
		
		
		client.on('disconnect' , function(socket){
			clients--;
			console.log("Client disconnected.... number of clients is "+ clients);
		});
		

//------------------------------ Subject Reschedule -------------------------------------------------------------------------------


	socket.on('ValidateTTRescheduling' , function(jsonobj){
	
		console.log("Recieved object is "+jsonobj);
		var data = JSON.parse(jsonobj);
		console.log("Data is "+data);
		var code = data.code;
		var object = data.requestObject;
		console.log("Code is "+code);
		var codeStr = [code];	
		var tempArray = updates[codeStr];
		
		console.log("TempArray contains :"+JSON.stringify(tempArray));
		if(tempArray != null){
			console.log("Array not empty .. ");
			tempArray.push(object);
			updates[codeStr] = tempArray;
		}else{
		
			console.log("Array empty .. creating the array");
		
			tempArray = [];
			tempArray.push(object);
			console.log("Code str is "+codeStr);
			updates[codeStr] = tempArray;
		
		
		}
		
		console.log(updates);
			
	
	
	});
	
	
	socket.on('LookForUpdates' , function(jsonobj){
	
		console.log("Recieved object is "+jsonobj);
		var data = JSON.parse(jsonobj);
		console.log("Data is "+data);
		var code = data.Code;
		console.log("Code is "+code);
		var codeStr = [code];	
	
		var objToSend = updates[codeStr];
	
		if(objToSend != null){
		
			
			console.log("Data found ...."+JSON.stringify(objToSend));
			socket.emit('updates',objToSend );
			// remove the object from the array.
			var array = updates[codeStr];
			console.log("Initially ..."+JSON.stringify(array));
			array = array.filter(function(el){ return el.RequestFacEID != code; });
			if(array.length == 0){
				console.log("array length 0");
				delete updates[codeStr];
				console.log("Now updates is "+JSON.stringify(updates));
			}else{
				updates[codeStr] = array;
			}
			
			console.log("Socket emmitted..");
			// delete the object from array 
		}else{
			console.log("No Data found ....");
			socket.emit('updates',"0" );
		
		}
		
	});
	
	socket.on('RespondToReq' , function(data){
	
		var validUsers = [];
		console.log("In RespondToReq");
		var json = JSON.parse(data);
		console.log("Recieved object is "+JSON.stringify(json));
		var RescCode = json.RescFacEID;
		// remove object of this code from updates array;
		var reqCode = json.RequestFacEID;
		// add this code in updates array
		var subjCode = json.SubjCode;
		var div = json.Div;

		var isAccepted = json.isAccepted;
		if(isAccepted == 1){
			// request is accepted use the lookup query
			
			console.log("Request is accepted");
			SubjectsColl.aggregate([{$match:{ "_id" : subjCode }  },{ $unwind: "$students"  },{ $lookup : { from: "basicUserDetails", localField: 							"students",foreignField:"_id", as:"matched"  }}   ]).toArray( function(error , result){
			
			console.log(result);
			
			for(var i=0; i<result.length; i++){
		 	
		 		var obj = result[i];
		 		//console.log(obj);
		 		 var matched = obj.matched;
		 		console.log(matched);
		 		if(matched.length >0){
		 			var obj1 = matched[0];
		 			if(obj1.div == div){
		 				console.log("yessssssssssssss");
		 				validUsers.push(obj1._id);
		 				var tempArray = updates[obj1._id];
		
						console.log("TempArray contains :"+JSON.stringify(tempArray));
						if(tempArray != null){
							console.log("Array not empty .. ");
								tempArray.push(json);
							updates[obj1._id] = tempArray;
						}else{
		
							console.log("Array empty .. creating the array");
		
							tempArray = [];
							tempArray.push(json);
							console.log("Code str is "+obj1._id);
							updates[obj1._id] = tempArray;
		
		
						}
		 			
		 			}
		 		}
		 		
		 		 
		 	}
		 	console.log("Send notifications to "+validUsers);
		 	console.log("Updates array is "+JSON.stringify(updates));
			
			
			
			
			});
		 
			
			
		}else{
		console.log("Request is not accepted");
			
			// request is not accepted
		}

		var codeStr = [RescCode];	
	
		var array = updates[codeStr];
		console.log("Initially ..."+JSON.stringify(array));
		if(array != null){
		array = array.filter(function(el){ return el.RequestFacEID != reqCode; });
		if(array.length == 0){
				delete updates[codeStr];
				console.log("array length 0");
			}else{
				updates[codeStr] = array;
			}
		}
		console.log("filtered.... "+JSON.stringify(updates));
		// add the new object for reqCode.
		codeStr = [reqCode];	
		var tempArray = updates[codeStr];
		
		console.log("TempArray contains :"+JSON.stringify(tempArray));
		if(tempArray != null){
			console.log("Array not empty .. ");
			tempArray.push(json);
			updates[codeStr] = tempArray;
		}else{
		
			console.log("Array empty .. creating the array");
		
			tempArray = [];
			tempArray.push(json);
			console.log("Code str is "+codeStr);
			updates[codeStr] = tempArray;
		
		
		}
		
		console.log(updates);
			
		
		
	
	});
			
		
		
		
		
// ------------------------------- INFORMATION EXTRACTION CODE -----------------------------------------------------------------------

	socket.on('Allinfo' , function(data){
		
		allInfoModule.allInfo(clients, data , db , socket );
		//validateDBOperation();


	});


//--------------------------------Register Student to a subject------------------------------------------------------------------------


		socket.on('RegisterStudent' ,function(data, callback){
		
			registerStudentModule.registerStudent(clients , data , callback , socket , db );	
		
		});

//-------------------------------------Send data (Generic func to send all data ) ------------------------------------------------------------------------


		socket.on('getAllData', function(JsonData){
			
			getAllDataModule.getAllData(clients , JsonData , db , socket);
	
		});

// ------------------------------------- LOGIN CODE---------------------------------------------------------------------------		
		
		socket.on('login' ,function(user){
				
				loginModule.login(clients , user ,users , socket );
			
		}); // end of login.
		
//------------------------------------------ FETCH FACULTY TT ---------------------------------------------------------------------

		socket.on('fetchFacultyTT' , function(jsonobj){
		
			facultyTT.facultyTT(clients, socket , db , jsonobj , TTFacultyColl);
		
		});

//-------------------------------------------FETCH FACULTY SUBJECTS ---------------------------------------------------------------------


		
		socket.on('facultySubjects', function(jsonobj){
		
			facultySubj.facultySubjects(clients, facultySubjColl, socket , db , jsonobj);
		
		});
// ---------------------------------------------REGISTER----------------------------------------------------------------------------------

		
		socket.on('register', function(user){
		
			registerModule.register(clients, user, socket , users);

		}); // end of socket.on

// -----------------------------------------------------------------------------------------------------------------------------------------
	});	

	}// else
	
	
	
}); // mongod connect




client.listen(port);
console.log("Connected on port "+port);

//code ends








