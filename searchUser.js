
exports.searchUser= function(db ,  socket , s){
	

	var users  = db.collection("Users");
	
	
	
    
    users.find({
    "$or": [ {
       "firstName": { "$regex": s , "$options": "i"} 
    },
    {
    "lastName": { "$regex": s , "$options": "i" }
    }]}
    
    
    
    
    
    ).toArray(function(err , result){
    
    if(err)throw error;
    
    //console.log(JSON.stringify(result));
    console.log("Total results are "+result.length);
    var arr= [];
    var count =0;
    
    while(count != result.length){
    
    	var obj = result[count];
    	var o = {};
    	var res = obj.firstName +" "+ obj.lastName;
    	o['id'] = obj._id;
    	o['name'] = res;
    	console.log(obj.firstName +" "+ obj.lastName);
    	arr.push(o);
    	count++;
    }
    
    
    console.log(arr);
    socket.emit('searchResult' , arr);
    
    });	
    
    
   
		
}

