

exports.load= function(db ,  socket){


	var users  = db.collection("Users");
		
		
	var query = {_id : /^E/}
		
		users.find(query).toArray(function(err , result){
	
			if(err)throw err;
			console.re.log("resukts are "+JSON.stringify(result));
			//socket.emit('fetchedResults' , result);
			var count = 0;
			var res = {};
			var arr= [];
			while(count != result.length){
			
			
				var obj = result[count];
			
				
					var name = obj.firstName +" "+ obj.lastName;
					var o = {};
					o['name'] = name;
					o['eid'] = obj._id;
					arr.push(o);
					
				
				count++;
			}
			
			res['FacultyMap'] = arr;
			
			console.re.log("Results are "+JSON.stringify(res));
			socket.emit('fetchedResults' , res);
	
			
	
	
		});
	
	
	
	
}

