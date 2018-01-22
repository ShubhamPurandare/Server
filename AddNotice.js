exports.store = function(db , socket , jsonObj)
{
var coll = db.collection("Posts");
var coll2 = db.collection("MyUpdates");	
	
	
	var insertPost = function(noticeFor){
	coll.insert( {  title : title , desc : desc , sender_id : sender_id,  sender_name : sender_name ,
						 		validUsers : noticeFor } , function(error,obj){
								if(error){
									console.log("Error");
									socket.emit("NoticePosted","0");
								}else{
									console.log(JSON.stringify(obj.ops));
									var ops = obj.ops[0];
									console.log(JSON.stringify(ops._id));
									var temp = ops._id;			
									insertUpdates(temp,noticeFor);
									socket.emit("NoticePosted","1");
								}
	});
	
	}
	
	
	
	
	var postInsert = function(id,receiver_id)
	{
		coll2.find({"_id":receiver_id}).toArray(function(err,res){
				if(err)
				{
					throw(err);
				}
				else
				{
					if(res.length==0)
					{
					
					console.log("id"+receiver_id+" does not exist");
						var arr = [];
						arr.push(id);
						coll2.insert({_id:receiver_id,updates:arr});
						console.log("Inserted");
						
					}
					else
					{
						console.log("ID is "+receiver_id);
						var obj = res[0];
						console.log(JSON.stringify(obj));
						var arr = obj.updates;
						arr.push(id);
						coll2.update({"_id":receiver_id }, {$set: { updates : arr}},function(err , result){if(err)throw err;});
					}
				}
			});
	}
	
	var insertUpdates = function(id,array)
	{
	
		var i=0;
		while(i<array.length)
		{
		
		console.log("ID is "+array[i]);
			postInsert(id,array[i]);
		i++;
		}
		
	}
	
	
	var coll1 = db.collection("basicUserDetails");
	var sender_id = jsonObj.ID;
	var sender_name = jsonObj.Name;
	var title = jsonObj.Title;
	var desc = jsonObj.Desc;
	var pref = jsonObj.Pref;
	var noticeFor = [];
	
	console.log(JSON.stringify(jsonObj));
	if(pref.All==1)
	{	
	
	console.log("In ALLLLL");
		coll1.find().toArray(function(err,result){
			
			for(var i in result){
			
				var obj = result[i];
				noticeFor.push(obj._id);
			}
			
			console.log("Notice for "+noticeFor);
			insertPost(noticeFor);
		});
		
	}
	else if(pref.Branch==1)
	{
		var branch = pref.my_branch;
		console.log("branch is  "+branch);
			
		coll1.find({ "branch":branch }).toArray(function(err,result){		
			for(var i in result){
			
				var obj = result[i];
				noticeFor.push(obj._id);
			}
			
			console.log("Notice for "+noticeFor);
			insertPost(noticeFor);
		});
	}	
	else if(pref.Div==1)
	{
	console.log("in div");
		var div = pref.my_div;
		var year = pref.my_year;
		var branch = pref.my_branch;
		console.log("Div "+branch + year + div);
		coll1.find( {$and:[ { "branch":branch },{"div":div},{"year":year}]}).toArray(function(err,result){
			
			for(var i in result){
			
				var obj = result[i];
				noticeFor.push(obj._id);
			}
			
			console.log("Notice for "+noticeFor);
			insertPost(noticeFor);
		});
	}
	
	
}

















