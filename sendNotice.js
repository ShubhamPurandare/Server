



exports.send = function(code , socket , noticeUpdate , fs,postsCall)
{
var notices = [];


var print = function(object)
{
	console.re.log(JSON.stringify(object));
}
function base64_encode(file) {
   if (fs.existsSync(file)) {
			// file exists
			// read binary data
	 	   var bitmap = fs.readFileSync(file);
	    	// convert binary data to base64 encoded string
	    	return new Buffer(bitmap).toString('base64');
		}
		return null;
}

var getPosts = function(socket , id,len){
		
		console.re.log("id is "+id);


		postsCall.find({"_id":id}).toArray(function(err,res){
			if(err)
			{
				throw(err);
			}
			else
			{
				if (res[0] != null) {


				
				print("Res is "+res);
				var obj = res[0];
				print(res[0]);
				if (obj.isImageAttached == 1) 
				{
					var imgPath = obj.Image;
					//var encodedImage = base64_encode(imgPath);
					//console.re.log(encodedImage);
					//obj.Image = encodedImage;
				}
				notices.push(obj);
			
				if(notices.length==len)
				{
					console.re.log("Done");
					print(notices);
					socket.emit("PostsResults",notices);
					console.re.log("Sent");
					notices = [];
				}
			}
			}
		});
	}	
	
	var clear = function(id){
		var temp = [];
		noticeUpdate.update({"_id":id},{$set:{updates:temp}});	
	}


	
noticeUpdate.find({"_id":code}).toArray(function(error,res){
			if(error)
			{
				throw(error);
			}
			else
			{
				if (res.length !=0) {
				var obj = res[0];
				print(obj);
				var arrayOfUpdates = obj.updates;
				var i=0;
				while(i<arrayOfUpdates.length)
				{
					console.re.log("Elements are "+arrayOfUpdates[i]);
					getPosts(socket , arrayOfUpdates[i],arrayOfUpdates.length);
					i++;
				}
				clear(code);	
			}
		}
		});
}