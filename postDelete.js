exports.delete = function(clients , JsonData , db , socket)
{

	var pid = JsonData.pid;
	console.re.log("Pid to delete is "+pid);

	var postsCall = db.collection("Posts");
	var basicUserDetails = db.collection("basicUserDetails");
	var noticeUpdate = db.collection("MyUpdates");
				


	var addDeleteUpdate = function(pid ,id ){

		console.re.log("Id to Update is "+id);


		noticeUpdate.find({_id : id}).toArray(function(err, res){

			if (err) {throw err;}

			var obj = res[0];
			var array = obj.updates;
			if (array.indexOf(pid)!= -1) {

				var index = array.indexOf(pid);
				array.splice(index, 1);
				noticeUpdate.update( {"_id" :id }  , {$set : { updates : array }} );

			}else{


				noticeUpdate.update( {"_id" :id } , {$addToSet : { MyDeletedPostsUpdates : pid  } } ,function(err , result){if(err)throw err;} );
		

			}

		});





	}

	postsCall.find({_id : pid} ).toArray(function(err, res){

		if (err) {throw err;}

		if (res.length!=0) {
			var obj = res[0];
			var validUsersArray = obj.validUsers;
			// add a delete req in Updates of all validUsers
			// delete this post

			for (var i = validUsersArray.length - 1; i >= 0; i--) {
				var id = validUsersArray[i];
				addDeleteUpdate(pid ,id );
			}
			

			postsCall.remove({_id : pid});
			socket.emit("postDeleteResult" , "1");

		}
	
	});

		




}