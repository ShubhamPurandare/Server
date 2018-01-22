
const assert = require("assert");

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
 
 console.log("ERROR");
 
 }
