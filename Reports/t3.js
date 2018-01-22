var mongo = require('mongodb').MongoClient;
 
var MJ = require("mongo-fast-join"),
mongoJoin = new MJ();
 
var fs = require('fs');
var j2xls = require('json2xls-xml')({ pretty : true });
var mongoXlsx = require('mongo-xlsx');
var sizeof = require('object-sizeof');



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
		var arr;
		
		

		mongoJoin
		    .query(
		      db.collection("Users"),
		      {  }, //query statement
			{}, //fields{
			{
			    limit: 10000//options
			}
			
		    ).join({
        joinCollection: db.collection("basicUserDetails"),
        //respects the dot notation, multiple keys can be specified in this array
        leftKeys: ["_id" , "Branch"],
        //This is the key of the document in the right hand document
        rightKeys: ["_id"],
        //This is the new subdocument that will be added to the result document
        newKey: "basicuserdetails"
    }).join({
        joinCollection: db.collection("parentInfo"),
        //respects the dot notation, multiple keys can be specified in this array
        leftKeys: ["_id"],
        //This is the key of the document in the right hand document
        rightKeys: ["_id"],
        //This is the new subdocument that will be added to the result document
        newKey: "parentInfo"
    }).join({
        joinCollection: db.collection("personalDetails"),
        //respects the dot notation, multiple keys can be specified in this array
        leftKeys: ["_id"],
        //This is the key of the document in the right hand document
        rightKeys: ["_id"],
        //This is the new subdocument that will be added to the result document
        newKey: "personalDetails"
    }).join({
        joinCollection: db.collection("residentialInfo"),
        //respects the dot notation, multiple keys can be specified in this array
        leftKeys: ["_id"],
        //This is the key of the document in the right hand document
        rightKeys: ["_id"],
        //This is the new subdocument that will be added to the result document
        newKey: "residentialInfo"
    }).join({
        joinCollection: db.collection("academicDetails"),
        //respects the dot notation, multiple keys can be specified in this array
        leftKeys: ["_id"],
        //This is the key of the document in the right hand document
        rightKeys: ["_id"],
        //This is the new subdocument that will be added to the result document
        newKey: "academicDetails"
    }).exec(function (err, items) {
        console.log("Size is "+sizeof(items));
        
        proceed(items);
        
        
        
        
    });
    
    


	}
	
	
	
	var proceed = function(items){
	
	var finalArr = [];
	
	//fs.writeFileSync('data4.xls', j2xls(items), 'binary');
		var nameArr = ["basicuserdetails" , "parentInfo", "personalDetails" , "residentialInfo" ,"academicDetails" ];
		
		
		var c =0;
		while(c != items.length){
		
			console.log("Loop "+c);
			
			var item = items[c];
			var r1= {};
			var d=0;
			while(d != nameArr.length){
			
				var name = nameArr[d];
				console.log(name);
				if(item[name] != null){
					var temp = item[name];
				
					for(var key in temp) r1[key] = temp[key];
					delete item[name];
					
				}
				
				d++;
			}
			for(var key in item) r1[key] = item[key];
			finalArr.push(r1);
			
			
			
			c++;
			
			
			
		
		}
		
		console.log("FINAL ARRAY IS "+finalArr);
		
			var model = mongoXlsx.buildDynamicModel(finalArr);
			mongoXlsx.mongoData2Xlsx(finalArr, model,  function(err, data) {
			  console.log('File saved at:', data.fullPath);
			  fs.rename("./"+data.fullPath, './test5.xls', function(err) {
			    if ( err ) console.log('ERROR: ' + err);
			    console.log("File saved");
			 	
			});
		});
		
			
		
	
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
});
