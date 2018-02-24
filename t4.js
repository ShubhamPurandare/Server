
const assert = require("assert");
var consolere = require('console-remote-client').connect('console.re','80','VIConnectChannel');

var i = {

"name" : "Shubham",
"surname" : "Purandare" ,
"std" : "se"
};


var j = {

"std" : "se",
"surname" :  "Purandare" ,
"name" : "Shubham"
};





try{
 assert.deepEqual(i , j , "yes") ;
 }catch( e){
 
 console.re.log("ERROR");
 
 }
