
var nodemailer = require('nodemailer');
var consolere = require('console-remote-client').connect('console.re','80','VIConnectChannel');
var transporter = nodemailer.createTransport( "SMTP", {
  service: 'gmail',
  auth: {
    user: 'dreambig704@gmail.com',
    pass: 'rulebreakers'
  }
});

var mailOptions = {
  from: 'dreambig704@gmail.com',
  to: 'shubham.purandare@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.re.log(error);
  } else {
    console.re.log('Email sent: ' + info.response);
  }
}); 
