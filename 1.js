var tokens = new Array("8.00" , "9.00" , "10.30" , "11.30" , "1.15", "2.15", "3.30" , "4.30", "5.30" );


var i = tokens.indexOf("8.00");
tokens.splice(i , 1);

var regexstring = "whatever";
var regexp = new RegExp(regexstring, "gi");
var str = "whateverTest";
var str2 = str.replace(regexp, "other");

console.log(str2);