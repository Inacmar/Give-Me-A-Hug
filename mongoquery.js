var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/my_db";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    db.collection("users").find({}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
    });
});