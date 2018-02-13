exports.update= function(db , socket , jsonObj , TimeTable ){

	var print = function(msg){
		console.log(JSON.stringify(msg));
	}

	console.log("In function");

	var days = ["Monday" , "Tuesday" , "Wednesday" , "Thursday" , "Friday" , "Saturday"];
	var id = jsonObj.id;
	var arrayOfFac = jsonObj.Object;
	console.log("The json is "	);
	console.log("id is "+id);
	print(jsonObj);
	var updatedDayArray = [];
	var updatedTT = {};

	
	
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






			}

			


		}
		
	});



}














