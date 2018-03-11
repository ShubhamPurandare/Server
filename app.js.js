


var app = express()

app.get('/dp_pics/:id', function (req, res, next) {
    var id = req.params.id;
    console.re.log('The id: ' + id);
 res.sendFile('/home/shubham/Server/Media/UserDP/'+id);


// res.sendFile('/home/shubham/'+id);
});

app.get('/postpics/:id', function (req, res, next) {
    var id = req.params.id;
    console.re.log('The id: ' + id);
 res.sendFile('/home/shubham/Server/Media/PostMedia/'+id);

// res.sendFile('/home/shubham/'+id);
});