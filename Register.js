
var nodemailer = require("nodemailer");


var smtpTransport = nodemailer.createTransport("SMTP",{
   service: "Gmail",  // sets automatically host, port and connection security settings
   auth: {
       user: "shubham.purandare@gmail.com",
       pass: "radarockssmp"
   }
});

exports.register = function(clients, user, socket , users){




	console.log("In register method");
			var jsonobj = JSON.parse(user); //convert into json obj
			console.log("json string is "+jsonobj);
			var authComplete = 0;
			var username = jsonobj.username;
			var email = jsonobj.email;
			var password = jsonobj.password;
			var branch = jsonobj.branch;
			var year = jsonobj.year;
			var grNumber = jsonobj.grNumber;
			var firstName = jsonobj.FirstName;
			var lastName = jsonobj.LastName;
			var faculty = jsonobj.Faculty;
			var discipline = jsonobj.Discipline;
			var program = jsonobj.Program;
		
			console.log("name is "+firstName + " lastname is "+lastName);
			
			
			users.find({_id:grNumber}).toArray(function(err,data){
			
				if(err){
						throw error;
					}else{
						if(data.length == 1){
							console.log("User is already registered for GRNUMBER : "+grNumber);
						}else{
						
						
						users.insert( { _id :grNumber, username : username , email : email , password :password,  branch : branch ,
						 		year : year, firstName :firstName, lastName:lastName , faculty:faculty , 									discipline:discipline , program:program } , function(error){
								if(error){
									console.log("Error in registeration");
									authComplete=0;
									socket.emit('registerResult' , authComplete);
		
								}else{
									var fullName = firstName+" "+lastName;
									//sendResgistrationEmail(fullName, email);
									console.log("Inserted in database successfully.. ");
									authComplete = 1;
									socket.emit('registerResult' , authComplete);
		
									}
								});
						
						
						
							}
						
						}
			
			
			
					});
			
			
			
				
				
				socket.on('Ping' , function(data, callback){
				
				console.log("Pinged!!!");
					var callback = callback || function(){};
					callback(true);
				
				});
				
				
				
	
				

}



function sendResgistrationEmail(Name, email){

	console.log("in function sendMail");
	smtpTransport.sendMail({  //email options
	   from: "Shubham Purandare<shubham.purandare@gmail.com>", // sender address.  Must be the same as authenticated user if using Gmail.
	   to: Name+"<"+email+">",  // receiver
	   subject: " WELCOME ABOARD", // subject
	   text: "We have sucessfully registered you! Enjoy all the features of the app. Thankyou. " // body
	}, function(error, response){  //callback
	   if(error){
	       console.log(error);
	   }else{
	       console.log("Message sent: " + response.message);
	   }
	   
	   smtpTransport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
	});
}
