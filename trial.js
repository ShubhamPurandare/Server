
var mongo = require('mongodb').MongoClient;


		

mongo.connect('mongodb://BornCoders:radarockssmp1@ds111529.mlab.com:11529/viit' , function(err , db){

	if(err){
		throw err;
		console.log("Error connecting to mlab ...");
	}else{
			console.log("Connected to mlab ...");

var coll = db.collection("basicUserDetails");



coll.aggregate(

	[
	
		{
			$group : {  _id : {'div': "$div", 'branch': "$branch"}     , students :{$push : { "_id" : "$_id" , "name" : "$my_name" } } ,"count": {$sum:1}  }
		
		},
		{"$lookup":{"from":"personalDetails","localField":"_id","foreignField":"_id","as":"personalDetails"}}
		
		
		
		
	]

).toArray(function(err, result){
		
			if(err)throw err;
			
			console.log(JSON.stringify(result));
			
			
			
			
		});




	
	/*coll.aggregate(
	
	
	
[{"$match":{"branch":"Computer"}},{"$match":{"year":"TE"}},{"$match":{"div":"C"}},

{"$lookup":{"from":"personalDetails","localField":"_id","foreignField":"_id","as":"personalDetails"}}
,
{
	$unwind :  "$personalDetails" 
}
,

    { $group : {
            _id : "$_id",
            posts : {$push : "$$ROOT"}
    }}
]


	
	
	
	
	).toArray(function(err, result){
		
			if(err)throw err;
			
			console.log(JSON.stringify(result));
			
			
			
			
		});*/
		

}
});



