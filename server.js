
// dependencies
var port     = process.env.PORT || 8083;
var mongo = require('mongodb').MongoClient;
var client = require('socket.io')();
var clients = 0;
var express = require('express')
var app = express()

var ObjectId = require('mongodb').ObjectId;

var rooms = [];
//var nodemailer = require("nodemailer");
var consolere = require('console-remote-client').connect('console.re','80','VIConnectChannel');
var facultySubj = require("./FacultySubjects");
var facultyTT = require("./FacultyTT");
var loginModule = require("./Login");
var registerModule = require("./Register");
var getAllDataModule = require("./GetAllData");
var registerStudentModule = require("./RegisterStudent");
var allInfoModule = require("./AllInfo");
var getMatch = require("./getData");
var searchRes = require("./search");
var loadMap = require("./LoadFacultyHashMap");
var searchUser = require("./searchUser");
var sendKeys = require("./sendKeys");
var profileStats = require("./ProfileStats");
var addNotice = require("./AddNotice");
var sendNotice = require("./sendNotice");
var createPage = require("./createPage");
var getFile = require("./getFile");
var updateTT = require("./updateTT");
var getAttachments = require("./getAttachments");
var Facs = require("./freeFacs");
//var getDocbyID = require("./");
var fs = require('fs');
var updates = {};
var notices = [];

var print = function(object)
{
	console.log(JSON.stringify(object));
}

mongo.connect('mongodb://BornCoders:radarockssmp1@ds111529.mlab.com:11529/viit' , function(err , database){

	if(err){
		throw err;
		console.log("Error connecting to mlab ...");
	}else{
		var db = database.db("viit");
		

		console.log("Connected to mlab ...");
		var collection = db.collection("Chat"); // create and define all collections here ..
		var profile = db.collection("profile");
		var users = db.collection("Users");
		var personalDetails = db.collection("personalDetails");
		var academicDetails = db.collection("academicDetails");
		var basicUserDetails = db.collection("basicUserDetails");
		var residentialInfo = db.collection("residentialInfo");
		var parentInfo = db.collection("parentInfo");
		var chatSection = db.collection("chatSection");
		var attendance = db.collection("attendance");
		var Certificates = db.collection("Certificates");
		var TimeTable = db.collection("Load_Time_Table");
		var facultySubjColl = db.collection("FacultyAllocation");
		var TTFacultyColl = db.collection("Load_Time_Table");
		var SubjectsColl = db.collection("Subjects");
		var noticeUpdate = db.collection("MyUpdates");
		var postsCall = db.collection("Posts");
		var freeFacs = db.collection("FreeFacs");
		var AllLogs = db.collection("AllLogs");



		var allFieldsString = ["personalDetails" , "academicDetails","basicUserDetails", "residentialInfo", "parentInfo"]
		var allFields = [personalDetails, academicDetails, basicUserDetails, residentialInfo, parentInfo];
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
		


	socket.on('getFreeFacs' , function (jsonObj){
	
		Facs.freeFacs(db , socket , jsonObj , freeFacs );
	});
		

	
	socket.on('UpdateTT' , function (jsonObj){
	
		updateTT.update(db , socket , jsonObj , TimeTable );
	});
	
	socket.on('FetchAttachments' , function(jsonObj){

		getAttachments.getAttachments(jsonObj , fs , socket);
	});
	
	socket.on('PostNotice' , function (jsonObj){
	
		addNotice.store(db , socket , jsonObj , fs);
	});
	
//-----------------------------Posts to Server ends-----------------------
	socket.on('Stats' , function (jsonObj){
	
		profileStats.stats(db , socket , jsonObj);
	});


	socket.on('getKeys' , function(collname){  // get keys of a collection
	
		sendKeys.sendkeys(socket ,clients , db , collname);
	});

	socket.on('search', function(s){
	
		searchUser.searchUser(db ,  socket , s);
	});

	socket.on('FetchFacultyMap', function(){
	
		loadMap.load(db ,  socket);
	});

	socket.on('SearchUser' , function(key){
		searchRes.searchFun( key, socket , db);
	
	});


	socket.on('findMatch' , function(JsonData){
		getMatch.getData(clients , JsonData , db , socket);
	});



	

	
	socket.on('ValidateTTRescheduling' , function(jsonobj){
	
		console.log("Recieved object is "+jsonobj);
		var data = JSON.parse(jsonobj);
		console.log("Data is "+data);
		var code = data.code;
		var object = data.requestObject;
		console.log("Code is "+code);
		var codeStr = [code];	
		var tempArray = updates[codeStr];
		noticeUpdate.update( {"_id" :code } , {$addToSet : { MyRescUpdates : object  } } ,function(err , result){if(err)throw err;} );

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

		if (code == "Admin") {
			// fetch admin updates 1. see if any new page is added
			var pagesColl = db.collection("Pages");
			pagesColl.find({"isApproved": 0}).toArray(function(err , res){

				if (err) {throw err;}

				if (res.length == 0) {
					// no newly added pages.
				}else{

					var array = [];
					for (var i = 0; i < res.length; i++) {
						var obj = res[i];
						var o = {};
						o["_id"] = obj._id;
						o["name"] = obj.page_name;
						array.push(o);
					}

					socket.emit('Adminupdates' , array);
					console.log("data emmitted"+JSON.stringify(array));
				}

			}); 

		}

		noticeUpdate.find({"_id":code}).toArray(function(err , res){
		// this section will see if user has any tt updates

			if (err) {throw err;}

			if (res.length !=0) {
				var object = res[0];
				if (object.isTTUpdated) {
						socket.emit('TimeTableUpdates' , "1");

				}
			}

		});

	
		
		sendNotice.send(code , socket , noticeUpdate , fs ,postsCall ); // check if user has any new post update
	

		// see if user has any resc resc updates
		noticeUpdate.find({"_id":code}).toArray(function(error,res){
			if(error)
			{
				throw(error);
			}
			else
			{
				if (res.length !=0) {

					var obj = res[0];
					var arrayOfResc = obj.MyRescUpdates;
					if (arrayOfResc != null && arrayOfResc.length != 0) {
						var arrayOfRescToSend = [];
						// the array consists of some updates
						for (var i=0 ;i<=arrayOfResc.length - 1;  i++) {
							var obj =	arrayOfResc[i];
							if(   (obj.isViewed == 0  && obj.RequestType == "LecRescheduleRequest" )  ||  (obj.RequestType =="LecRescheduleResponse" ))
							{
								arrayOfRescToSend.push(obj);
								if (obj.RequestType =="LecRescheduleResponse" ) {

									noticeUpdate.update( {"_id" : code } , {$pull : { MyRescUpdates :{ id : obj.id  } }} );
	
									

								}
							}
						}

						socket.emit('updates',arrayOfRescToSend);


					}else{

						socket.emit('updates',"0" ); // no updates
					}

				}
			}
	});

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
		var dept = json.branch;
		console.re.log("Branch is "+dept);


		var updateid = json.id;
		noticeUpdate.update( {"_id" :RescCode } , {$pull : { MyRescUpdates :{ id : updateid  } }} ,function(err , result){if(err)throw err;} );
		//noticeUpdate.update( {"_id" :RescCode } , {$addToSet : { MyRescUpdates : json  } } ,function(err , result){if(err)throw err;} );
		noticeUpdate.update( {"_id" :reqCode } , {$addToSet : { MyRescUpdates : json  } } ,function(err , result){if(err)throw err;} );
		

		var isAccepted = json.isAccepted;
		if(isAccepted == 1){
			// request is accepted use the lookup query
			// insert a log in resc logs
			console.log("Request is accepted");
			// store this response in log collection


			AllLogs.find({_id : dept}).toArray(function(err, res){

				if (err) {throw err;}

				if (res.length == 0) {

					AllLogs.insert({ _id : dept   });
				}

			AllLogs.update( {"_id" :dept } , {$addToSet : { RescLogs : json  } } ,function(err , result){if(err)throw err;} );
		


			});

		/*	RescLogs.find(dept+"2018").toArray(function(err , res){

					if (err) {throw err;}

					if (res.length == 0) {

						// insert
						RescLogs.insert({ _id :dept+"2018" });
					}
	
					var tempobj = res[0];
					var array = tempobj.log;
					if(array==null)
					{
						array = [];
					}
					array.push(json);
					var obj = {};
					obj["log"]=array;	
					RescLogs.update({"_id":dept+"2018"},{$set : obj});
					// update


			});*/

			SubjectsColl.aggregate([{$match:{ "_id" : subjCode }  },{ $unwind: "$students"  },{ $lookup : { from: 			"basicUserDetails", localField:"students",foreignField:"_id", as:"matched"  }}   ]).toArray( function(error , result){
			
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

		 				var studentID = obj1._id;
	 					noticeUpdate.update( {"_id" :studentID } , {$addToSet : { MyRescUpdates : json } } ,function(err , result){if(err)throw err;} );
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
		
		allInfoModule.allInfo(clients,fs, data , db , socket );
		//validateDBOperation();


	});


//--------------------------------Register Student to a subject------------------------------------------------------------------------


		socket.on('RegisterStudent' ,function(data, callback){
		
			registerStudentModule.registerStudent(clients , data , callback , socket , db );	
		
		});

		socket.on('CreatePage' , function(jsonObj){

			createPage.create(jsonObj , socket , db, fs );
		});

		socket.on('getFile' ,function(jsonObj){

			getFile.get(jsonObj , socket , db, fs );
		});


//-------------------------------------Send data (Generic func to send all data ) ------------------------------------------------------------------------


		socket.on('getAllData', function(JsonData){
			
			getAllDataModule.getAllData(clients ,fs, JsonData , db , socket , ObjectId);
	
		});

// ------------------------------------- LOGIN CODE---------------------------------------------------------------------------		
		
		socket.on('login' ,function(user){
				
				loginModule.login(clients , user ,users , socket , basicUserDetails, fs);
			
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
		
			registerModule.register(clients, user, socket , users , basicUserDetails);
 
		}); // end of socket.on




// -----------------------------------------------------------------------------------------------------------------------------------------
	});	

	}// else
	
	
	
}); // mongod connect



//app.listen(8080);




client.listen(port);
console.log("Connected on port "+port);

//code ends








