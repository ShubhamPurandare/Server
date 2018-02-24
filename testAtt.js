var fs = require('fs');
var consolere = require('console-remote-client').connect('console.re','80','VIConnectChannel');

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}


var data = base64_encode("U1417654pptFri Jan 26 2018 00:33:19 GMT+0000 (GMT).ppt.ppt");
console.re.log(data);