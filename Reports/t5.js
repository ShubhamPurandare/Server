
var mongo = require('mongodb').MongoClient;
 
mongo.connect('mongodb://BornCoders:radarockssmp1@ds111529.mlab.com:11529/viit' , function(err , db){

	if(err){
		throw err;
		console.log("Error connecting to mlab ...");
	}else{
	
		var users = db.collection("Users");
		var personalDetails = db.collection("personalDetails");
		var academicDetails = db.collection("academicDetails");
		var basicDetails = db.collection("basicUserDetails");
		var residentialInfo = db.collection("residentialInfo");
		var parentInfo = db.collection("parentInfo");
		var personaldata, academicdata, userdata , basicdata , resdata , parentData, count=0 ;
		var finalData;
		var arr =[];
		
		var  p = "personalDetails";
		var id = "_id";
		var a = "academicDetails";
		
		
		
		
		var createObj = function(coll ){
	
	
	{
			
			var o1 = {
				$lookup :{
				from : coll,
				localField : "_id",
				foreignField : "_id",
				
				as : coll,
				
				}
			};
			}
			
			return o1;
	
		}
	
	
	var out = function(){
	
	var o1 = {
				
		$out : "Temp" 		
				
		};
		return o1;
			
	}
	
	var createMatch = function(key , val ){
	
			//var k = [key];
			var o ={};
			
			o[key] = val;
			var o1 = {
				$match : o
				
			};
			return o1;
	
		}
	
	
		
		 var o =createObj("Users");
		//arr.push(o);
		// o=createMatch("_id","U14567412");
		 
		//arr.push(o);
		
		o =createObj("academicDetails");
		arr.push(o);
		//o = out();
		//arr.push(o);
		o=createMatch("branch","computer");
		arr.push(o);
		o=createMatch("year","FE");
		 arr.push(o);
		
		
		console.log("Array is "+JSON.stringify(arr));
	
	
		users.aggregate(
		
		arr
		
		
		
		).toArray(function(err, result){
		
			console.log(JSON.stringify(result));
			
		
		});
		
		}
	});
