var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.set('view engine', 'html');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my_db');
var userSchema = mongoose.Schema({
    user: String,
    password: String
});
var User = mongoose.model("User", userSchema);

app.use(express.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

server.listen(process.env.PORT || 8081, function () {
    console.log('Listening on ' + server.address().port);
});

app.get('/game_1', function (req, res) {
    res.sendFile(__dirname + '/game_1.html')
});

app.post('/game_1', function (req, res) {
    res.send({status:'400', redirect: '/game_1', message: "Error. Try to log in again."});
});

app.get('/login_page', function (req, res) {
    console.log("Redirect to logged in page.");
    res.sendFile(__dirname + '/login_page.html');
});

app.post('/login_page', function (req, res) {
    var post = req.body;
    var newUser = new User({
        user: post.user,
        password: post.password
    });

    User.find({user: post.user},
        function (err, response) {
            console.log(typeof(response.user) === "undefined");
            if (typeof(response[0]) === "undefined") {
                newUser.save(function (err, User) {
                    if (err) {
                        console.log("Error saving user.");
                        res.send({status:'400', redirect: '/', message: "Error. Try to log in again."});
                    }
                    else {
                        console.log("successfully saved new user");
                        res.send({status:'200', redirect: '/login_page', message: ""});
                    }
                });
            } else {
                if (response[0].password === post.password) {
                    console.log("existing user");
                    res.send({status:'200', redirect: '/login_page', message: ""});
                }
                else {
                    console.log("Error. Try to log in again.");
                    res.send({status:'400', redirect: '/', message: "Error. Try to log in again."});
                }
            }
        }
    )
});

