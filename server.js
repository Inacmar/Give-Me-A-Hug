var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my_db');

app.use(express.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

server.listen(process.env.PORT || 8081,function(){
    console.log('Listening on '+server.address().port);
});

app.post('/login_page', function (req, res) {
	console.log(req.body);
	
  var post = req.body
  
  if (post.user === 'asd' && post.password === 'asd') {
    res.sendFile(__dirname+'/login_page.html');
  } else {
    res.send('Bad user/pass');
  }
});
