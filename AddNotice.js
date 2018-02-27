

exports.store = function(db , socket , jsonObj , fs)
{
var coll = db.collection("Posts");
var coll2 = db.collection("MyUpdates");	
	
// 3)	
	var insertPost = function(noticeFor){  // uploads the post in posts collection
	coll.insert( {  title : title , desc : desc , sender_id : sender_id,  sender_name : sender_name ,
						 		validUsers : noticeFor  , isImageAttached : isImageAttached , isPDFAttached : isPDFAttached
						 		, isPPTAttached : isPPTAttached  , isDocAttached : isDocAttached ,isExcelAttached:isExcelAttached } , function(error,obj){
								if(error){
									console.re.log("Error");
									socket.emit("NoticePosted","0");
								}else{
									console.re.log(JSON.stringify(obj.ops));
									var ops = obj.ops[0];
									console.re.log(JSON.stringify(ops._id));
									var temp = ops._id;
									personalPostLog(temp);		
									insertAttachments(temp);	
									insertUpdates(temp,noticeFor);
									socket.emit("NoticePosted","1");
								}
	});
	
	}
	

	var personalPostLog = function(post_id){


		coll1.find({ "_id" : sender_id}).toArray(function(err , res){

			if (err) {throw err;}

			if(res.length!=0)
			{
				var obj = res[0];
				if(obj!=null)
				{
					var array = obj.postsArray;
					if(array==null)
					{
						array=[];		
					}
					obj={};
					obj['postsArray'] = array;
					array.push(post_id);
					coll1.update({"_id":sender_id} , {$set:  obj }  );
					console.re.log("Added to my postsArray");
					
				}
			}	

		});

	}
	

	var insertAttachments = function(post_id){  // parse the attchments array and load each attachmant in the post

			var i = 0;
			var main = {};
			
			while(i < attachments.length){


				var obj = attachments[i];

				console.re.log(JSON.stringify(obj));
				var a = Object.keys(obj);

				console.re.log(a[0]);
				var k = a[0];
				
				main[k] = obj[k];
				//coll.update({_id : post_id} , {$set : { k1:obj[k1]  } } );
				i++;
			}
			coll.update({_id : post_id} , {$set:  main }  );



			


	}


	// 5)
	var postInsert = function(id,receiver_id) // posts the updates for each valid user
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
					
					console.re.log("id"+receiver_id+" does not exist");
						var arr = [];
						arr.push(id);
						coll2.insert({_id:receiver_id,updates:arr});
						console.re.log("Inserted");
						
					}
					else
					{
						console.re.log("ID is "+receiver_id);
						var obj = res[0];
						console.re.log(JSON.stringify(obj));
						var arr = obj.updates;
						arr.push(id);
						coll2.update({"_id":receiver_id }, {$set: { updates : arr}},function(err , result){if(err)throw err;});
					}
				}
			});
	}
	

	// 4)
	var insertUpdates = function(id,array)
	{
	
		var i=0;
		while(i<array.length)
		{
		
		console.re.log("ID is "+array[i]);
			postInsert(id,array[i]);
		i++;
		}
		
	}

	var storeAttachment = function(type , encodedData , filename){
		if (type == "jpg") {
			var data = "image"
		}else{
			data = type;
		}
		
		var base64Data = encodedData.replace(/^data:data\/type;base64,/, "");
		console.re.log(JSON.stringify(base64Data));
		fs.writeFile("./Media/PostMedia/"+filename+"."+type, base64Data, 'base64', function(err) {
		  console.re.log(err);
		});

	}
	
	// 1)
	var coll1 = db.collection("basicUserDetails");
	var sender_id = jsonObj.ID;
	var sender_name = jsonObj.Name;
	var title = jsonObj.Title;
	var desc = jsonObj.Desc;
	var pref = jsonObj.Pref;
	var noticeFor = [];
	var isImageAttached = jsonObj.isImageAttached;
	var isPDFAttached = jsonObj.isPDFAttached;
	var isPPTAttached = jsonObj.isPPTAttahced;
	var isDocAttached = jsonObj.isDocAttached;
	var isExcelAttached = jsonObj.isExcelAttached;
	var attachments = [];
	if (isExcelAttached == 1 ) {
		var encodedExcel = jsonObj.EXCEL;
		var date = new Date();
		var f = sender_id+"excel"+date;
		var fn_image = "./Media/PostMedia/"+sender_id+"excel"+date+".xls";
		var obj = {};
		obj['Excel'] = fn_image;
		attachments.push(obj);
		storeAttachment("xls" , encodedExcel , f);

	}
	if (isImageAttached == 1) {
		var encodedImage = jsonObj.Image;
		var date = new Date();
		//var imgType = jsonObj.ImageType;
		var f = sender_id+"image"+date;
		var fn_image = "./Media/PostMedia/"+sender_id+"image"+date+".jpg";
		var obj = {};
		obj['Image'] = fn_image;
		attachments.push(obj);
		storeAttachment("jpg" , encodedImage , f);
	}
	if (isPPTAttached == 1) {
		var encodedPPT = jsonObj.PPT;
		var date = new Date();
		var filename = sender_id+"ppt"+date;
		var fn = "./Media/PostMedia/"+sender_id+"ppt"+date+".ppt";
		var obj = {};
		obj['PPT'] = fn;
		attachments.push(obj);
		
		storeAttachment("ppt" , encodedPPT, filename );
	}
	if (isPDFAttached == 1) {
		var encodedPDF = jsonObj.PDF;
		var date = new Date();
		var filename = sender_id+"pdf"+date;
		var fn = "./Media/PostMedia/"+sender_id+"pdf"+date+".pdf";
		var obj = {};
		obj['PDF'] = fn;
		attachments.push(obj);
		storeAttachment("pdf" , encodedPDF, filename);
	}
	if (isDocAttached == 1) {
		var encodedDoc = jsonObj.DOC;
		var date = new Date();
		var filename = sender_id+"doc"+date;
		var fn = "./Media/PostMedia/"+sender_id+"doc"+date+".docx";
		var obj = {};
		obj['DOC'] = fn;
		attachments.push(obj);
		storeAttachment("docx" , encodedDoc, filename);
	}



	// 2)
	console.re.log(JSON.stringify(jsonObj));
	if(pref.All==1)
	{	
	
	console.re.log("In ALLLLL");
		coll1.find().toArray(function(err,result){
			
			for(var i in result){
			
				var obj = result[i];
				noticeFor.push(obj._id);
			}
			
			console.re.log("Notice for "+noticeFor);
			insertPost(noticeFor);
		});
		
	}
	else if(pref.Branch==1)
	{
		var branch = pref.my_branch;
		console.re.log("branch is  "+branch);
			
		coll1.find({ "branch":branch }).toArray(function(err,result){		
			for(var i in result){
			
				var obj = result[i];
				noticeFor.push(obj._id);
			}
			
			console.re.log("Notice for "+noticeFor);
			insertPost(noticeFor);
		});
	}	
	else if(pref.Div==1)
	{
	console.re.log("in div");
		var div = pref.my_div;
		var year = pref.my_year;
		var branch = pref.my_branch;
		console.re.log("Div "+branch + year + div);
		coll1.find( {$and:[ { "branch":branch },{"div":div},{"year":year}]}).toArray(function(err,result){
			
			for(var i in result){
			
				var obj = result[i];
				noticeFor.push(obj._id);
			}
			
			console.re.log("Notice for "+noticeFor);
			insertPost(noticeFor);
		});
	}
	
	
}