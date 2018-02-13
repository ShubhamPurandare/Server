
exports.create= function(jsonObj , socket , db , fs){



var storeAttachment = function(type , encodedData , filename){
		if (type == "jpg") {
			var data = "image"
		}else{
			data = type;
		}
		
		var base64Data = encodedData.replace(/^data:data\/type;base64,/, "");
		console.log(JSON.stringify(base64Data));
		fs.writeFile(filename+"."+type, base64Data, 'base64', function(err) {
		  if (err) {console.log(err);}

		  console.log("File : "+filename+"."+type + "  created");
		  
		});

	}


var insertPageInUserProfile = function(pageId , admin_id){

	var basicUserDetails = db.collection("basicUserDetails");
	basicUserDetails.find({"_id" : admin_id}).toArray(function(error , result){

		if (error) {throw err;}

		if (result.length!=0) {

			var obj = result[0];
			var pages = obj.pages;
			if (pages == null) {
				pages = [];

			}
			pages.push(pageId);

			basicUserDetails.update({"_id":admin_id} , {$set: {pages : pages}  });

		}


	});


}


	var pageColl = db.collection("Pages");
	var basicUserDetails = db.collection("basicUserDetails");
	var page_name = jsonObj.GroupName;

	pageColl.find({"page_name" : page_name }).toArray(function(error , result){

		if (error) {throw err;}

		if (result.length != 0) {

			// page with similar name exists;
			socket.emit("CreatePageResult","0");
			console.log("page name already exists");
		}else{

			// create page here..

			var date = new Date();
			var admin_id = jsonObj.Admin_id;
			var CoverDp = jsonObj.CoverDp;
			var DP = jsonObj.DP;
			var admin_name = jsonObj.Admin_name; 
			var Desc = jsonObj.Desc;
			var f = page_name+"DP"+date;
			var fn_Dp = page_name+"DP"+date+".jpg";
			storeAttachment("jpg" , DP , f);

			f = page_name+"Cover_DP"+date;
			fn_cover = page_name+"Cover_DP"+date+".jpg";
			storeAttachment("jpg" , CoverDp , f);

			pageColl.insert({admin_id : admin_id ,admin_name : admin_name,CoverDp : fn_cover , DP : fn_Dp , Desc:Desc ,page_name : page_name , Timestamp : date, isApproved : 0  }  , function(error,obj){
								if(error){
									console.log("Error");
									
								}else{
									console.log(JSON.stringify(obj.ops));
									var ops = obj.ops[0];
									console.log(JSON.stringify(ops._id));
									var temp = ops._id;		
									insertPageInUserProfile(temp , admin_id);	
									
								}
	});
	

			socket.emit("CreatePageResult" , "1");
			console.log("Page created successfully");
		}

	});




}