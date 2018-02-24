
exports.sendkeys = function (socket ,clients , db , collName ){
	 var c = db.collection(collName);
	
			
	 c.findOne( {},  function(err , data){
	 
	 	if(err)throw err;
	 	
	 	console.re.log("Coll name is "+collName);
	 	var obj = {};
	 	var array = [];
	 	var temp = Object.keys(data);
	 	for(var i=0; i<temp.length ; i++){
	 	
	 		array.push(temp[i]);
	 		
	 	
	 	}
	 	console.re.log(array);
	 	obj['name'] = collName;
	 	obj['keys'] = array;
	 	socket.emit('keys' ,obj );
	 	
	 	console.re.log("Keys emmitted..."+Object.keys(data));
	 
	 });
	 		
	
	
}
