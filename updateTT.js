exports.update= function(db , socket , jsonObj , TimeTable ){

	var print = function(msg){
		console.log(JSON.stringify(msg));
	}

	console.log("In function");
var updates = db.collection("MyUpdates");

	var days = ["Monday" , "Tuesday" , "Wednesday" , "Thursday" , "Friday" , "Saturday"];
	var id = jsonObj.id;
	var arrayOfFac = jsonObj.Object;
	console.log("The json is "	);
	console.log("id is "+id);
	print(jsonObj);
	var updatedDayArray = [];
	var updatedTT = {};

	var main = id.substr(-5);
	var div = main.substr(0 , 1);
	var one = id.substr(-11);
	var year = one.substr(0,2);
	var d = id.length -11;
	var dept = id.substr(0 , d);
	var arrayOfUsersToBeUpdated = [];

	var bud = db.collection("basicUserDetails");
		
	

	var postInsert = function(receiver_id) // posts the updates for each valid user
	{


		updates.find({"_id":receiver_id}).toArray(function(err,res){
				if(err)
				{
					throw(err);
				}

				if (res.length != 0) {


						console.log("ID is "+receiver_id);
						var obj = res[0];
						console.log(JSON.stringify(obj));
						
						updates.update({"_id":receiver_id }, {$set: { isTTUpdated:true}},function(err , result){if(err)throw err;});
					
				}
				
			});
	}

var insertUpdates = function(array)
	{
	
		var i=0;
		while(i<array.length)
		{
		
		console.log("ID is "+array[i]);
			postInsert(array[i]);
		i++;
		}
		
	}


	var sendNotificationsToUsers = function(){

		bud.find({
					 $and:[
						 {"branch":dept},
						 {"year":year},
						 {"div":div} 
					      ]}
					   ).toArray( function(error , result){

					   	if (error) {throw error;}

					   	console.log(result);

					   	for (var i in result){

					   		var obj = result[i];
					   		arrayOfUsersToBeUpdated.push(obj._id);


					   	}
					   	insertUpdates(arrayOfUsersToBeUpdated);






					   });


	}
						

	
	
	TimeTable.find({"_id" : id}).toArray(function(err , res){

		if (err) {throw err;}	

		console.log("res is "+print(res));
			
		if (res.length != 0) {
			var recObj = res[0];
			//print(recObj);

			for (var i = 0; i < arrayOfFac.length; i++) {
				var ob = arrayOfFac[i];
				var subCode = ob.SubjectCode;
				for(var i in days){
				var day = days[i];
				var dayOfObject = recObj[day];
				// day object
				console.log("Day is "+day);
				print(dayOfObject);
				updatedDayArray =[];
				for (var i = 0; i < dayOfObject.length; i++) {
					var ob1 = dayOfObject[i];
					if (ob1.SubjCode == subCode) {

						ob1['StaffEID'] = ob.FacultyCode;
						ob1['Staff'] = ob.FacultyName;
					}

					updatedDayArray.push(ob1);
				}
				updatedTT[day] = updatedDayArray;



			}

			console.log("THE FINAL TT IS ");
			print(updatedTT);
			updatedTT['_id'] =  id;

			TimeTable.update({"_id":id} , {$set:  updatedTT });
			sendNotificationsToUsers();






			}

			


		}
		
	});



}














