// livereload = require('livereload');
// server = livereload.createServer();
// server.watch(__dirname + "/public");

/* ======================================= */

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var format = require('util').format;

var studentGrade = null;

MongoClient.connect('mongodb://grade:1234@kahana.mongohq.com:10083/grade', function(err, db) {
  if(err) throw err;
  studentGrade = db.collection('student_grade');
});

/* ======================================= */

var port = 4000;
var express = require('express');
var app = express();
app.use(express.static('./public/'));

// http://127.0.0.1:4000/api/add/Java/1/F
app.get('/api/add/:subject/:credit/:grade', function(req, res){
  var data = {
    subject:  req.params.subject,
    credit:   req.params.credit*1,
    grade:    req.params.grade
  };

  studentGrade.insert(data, function(err, docs) {
    if(err) res.send({error:1});
    else res.send(docs);
  });
});

// http://127.0.0.1:4000/api/get
app.get('/api/get', function(req, res){
  studentGrade.find().toArray(function(err, results) {
    if(err) res.send({error:1});
    else res.send(results);
  });
});

// http://127.0.0.1:4000/api/delete/542698fe932cacfe1b76ae49
app.get('/api/delete/:id', function(req, res){
  studentGrade.remove({'_id':new ObjectID(req.params.id)}, function(err, results) {
    if(err) res.send({error:err});
    else res.send({complete: 1});
  });
});


app.listen(port);
console.log("\nhttp://127.0.0.1:"+port+"\n");
