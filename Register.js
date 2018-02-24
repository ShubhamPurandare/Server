
/*var nodemailer = require("nodemailer");


var smtpTransport = nodemailer.createTransport("SMTP",{
   service: "Gmail",  // sets automatically host, port and connection security settings
   auth: {
       user: "shubham.purandare@gmail.com",
       pass: "radarockssmp"
   }
});*/

exports.register = function(clients, user, socket , users , basicUserDetails){








	console.re.log("In register method");
			var jsonobj = JSON.parse(user); //convert into json obj
			console.re.log("json string is "+jsonobj);
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
			
			console.re.log("name is "+firstName + " lastname is "+lastName);
			


			var addEntryInBUD = function(){

							basicUserDetails.insert( { _id :grNumber , email : email ,  branch : branch ,
						 		year : year, firstName :firstName, lastName:lastName  }
						 		 , function(error){
								if(error){
									console.re.log("Error in registeration");
									
		
								}else{
									var fullName = firstName+" "+lastName;
									//sendResgistrationEmail(fullName, email);
									console.re.log("Inserted in BUD successfully.. ");
									//sendResgistrationEmail(fullName, email);
			
									
									}
								});
				}

			
			users.find({username : username }).toArray(function(err,data){
			
				if(err){
						throw error;
					}else{
						if(data.length == 1){
							console.re.log("Username exists  : "+username );
							
							if(data._id == grNumber  ){
								// same user is registering again
								console.re.log(" same user is registering again  : "+username );
								authComplete=3;
								socket.emit('registerResult' , authComplete);
								console.re.log("Emmiting socket");
			
							
							}else{
							
								// this username already exists.
								authComplete=2;	
									console.re.log(" try diff username  : "+username );
									socket.emit('registerResult' , authComplete);
									console.re.log("Emmiting socket");
			
							
							}
							
						}else{
						
								
							
			
						
						
						
						
						users.insert( { _id :grNumber, username : username , email : email , password :password,  branch : branch ,
						 		year : year, firstName :firstName, lastName:lastName , faculty:faculty ,discipline:discipline , program:program }
						 		 , function(error){
								if(error){
									console.re.log("Error in registeration");
									authComplete=0;
									socket.emit('registerResult' , authComplete);
									console.re.log("Emmiting socket");
			
		
								}else{
									var fullName = firstName+" "+lastName;
									//sendResgistrationEmail(fullName, email);
									console.re.log("Inserted in database successfully.. ");
									authComplete = 1;
									socket.emit('registerResult' , authComplete);
									console.re.log("Emmiting socket");

									addEntryInBUD();
									//sendResgistrationEmail(fullName, email);
			
									
									}
								});
						
						
						
							}
						
						}
					
						
						
					});
					
					
					
			
			
			
				
				
				socket.on('Ping' , function(data, callback){
				
				console.re.log("Pinged!!!");
					var callback = callback || function(){};
					callback(true);
				
				});
				
				
				
	
				

}



/*function sendResgistrationEmail(Name, email){

	var transporter = nodemailer.createTransport( "SMTP", {
  service: 'gmail',
  auth: {
    user: 'dreambig704@gmail.com',
    pass: 'rulebreakers'
  }
});

var mailOptions = {
  from: 'dreambig704@gmail.com',
  to: email,
  subject: 'Welcome Aboard',
  text: 'Welcome, now you can use all the features of the app.'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.re.log(error);
  } else {
    console.re.log('Email sent: ' + info.response);
  }
}); 
}*/
