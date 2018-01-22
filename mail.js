var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport( "SMTP", {
  service: 'gmail',
  auth: {
    user: 'dreambig704@gmail.com',
    pass: 'rulebreakers'
  }
});

var mailOptions = {
  from: 'dreambig704@gmail.com',
  to: 'koolkarniharsh@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
}); 
