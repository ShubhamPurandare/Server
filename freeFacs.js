exports.freeFacs = function(db , socket , jsonObj , freeFacs){


	var id = jsonObj.id;
	var key = jsonObj.key;


	freeFacs.find({
		"_id" : id 

	}).toArray(function(err , res){

		if (err) {throw err;}


		if (res.length != 0) {


			var obj = res[0];

			var mapstr = obj.map;

			var hashmap = JSON.parse(mapstr);

			var arrayToSend = hashmap[key];

			console.re.log(arrayToSend);
			socket.emit("freeFacsRes", arrayToSend);
		}

	});




}