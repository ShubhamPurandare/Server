
exports.searchFun= function( key, socket , db){

		var users = db.collection("Users");
		
		users.find({
			"username": key
		}).toArray( function(error , result){
			
			if(error)throw error;
			
			if(result.length != 0){
				socket.emit("SearchResult" , result);
			
			
			}else{
			
				console.re.log("No user found");
			}
		
		});
		
	
		



	
}
