var cors = require('cors')
var express = require('express');
var app = express();
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
const config = require('./configuration');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

const secret = "Marino-Tropeano";
const port = config.port;
const db_name = 'Database.DB';
const languages = ["python", "java", "scala", "r", "c++", "julia"];
const frameworks = ["pytorch", "tensorflow", "caffe", "keras", "deeplearning4j", "apache_mahout", "apache_singa"];
const dataset_datatypes = ["csv", "avro", "json"];


function check(list_to_check, element_to_check){
  var bool = false;
  list_to_check.forEach(function(element){
    if(element_to_check == element)
      bool = true;
  });
  return bool;
}


function makeid(length) {
   var id          = '';
   var from_this      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   for ( var i = 0; i < length; i++ ) {
      id += from_this.charAt(Math.floor(Math.random() * from_this.length));
   }
   return id;
}


function use_db(query, parameters){
    let db = require('better-sqlite3')(db_name);
    var rows = false;
    toExec =  db.prepare(query);
    if (query.split(" ")[0] == "INSERT") {
      toExec.run(parameters);
      rows = true;
    }
    else
      rows = toExec.all(parameters);
    db.close();
    return rows;
}


function decode_user(token){
   var tmp = token.split(" ")[1];
    decoded = jwt.verify(tmp, secret);
    return decoded.username;
}


app.post('/user/login', function (req, res){
    var	bj_user =	req.body.bj_user;
    var	bj_pwd = req.body.bj_pwd;
    result = use_db("SELECT * FROM users WHERE username = ? AND password = ?", [bj_user, bj_pwd]);
    if(result && result!=undefined && result.length > 0){
      res.json({'key' : jwt.sign({ username: bj_user }, secret)});
    }
    else{
     res.status(404);
     res.send("");
   }
});


app.post('/jobs', function (req, res){
    user = decode_user(req.headers.authorization);
    if(use_db("SELECT * FROM users where username = ?", [user])){
      var title = req.body.title;
      var lang = req.body.language.toLowerCase();
      var framework = req.body.framework.toLowerCase();
      var dataset = req.body.dataset;
      var datatype = req.body.dataset_datatype.toLowerCase();
      var model = req.body.model;
      var creation_time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
      var job_id = makeid(10);
      if(check(languages, lang) && check(frameworks, framework) && check(dataset_datatypes, datatype)){
        var query = "INSERT INTO jobs (user_id, title, language, framework, dataset, dataset_datatype, model, job_id, created_at, status) VALUES (?,?,?,?,?,?,?,?,?,'created')";
        if(use_db(query, [user, title, lang, framework, dataset, datatype, model, job_id, creation_time])){
          res.location(job_id);
          res.status(201);
          res.send("");
        }
        else{
          res.status(500);
          res.send("");
        }
      }
      else{
        res.status(400);
        res.send("");
      }
  }
});


app.get('/jobs', function (req, res){
  user = decode_user(req.headers.authorization);
  if(use_db("SELECT * FROM users where username = ?", [user])){
    result = use_db("SELECT * FROM jobs WHERE user_id = ?", [user]);
    if(result)
      res.json(JSON.stringify(result));
    else{
      res.status(404);
      res.send("");
    }
  }
});


app.get('/jobs/:job_id', function (req, res){
  user = decode_user(req.headers.authorization);
  if(use_db("SELECT * FROM users where username = ?",[user])){
    var job_id = req.params.job_id;
    result= use_db("SELECT * FROM jobs WHERE user_id = ? AND job_id = ?", [user, job_id])
    if(result!=undefined && result!=null && result.length > 0){
      res.json(JSON.stringify(result[0]));
    }
    else{
      res.status(404);
      res.send("");
    }
  }
});


app.listen(port, function () {
  console.log('Backend running on port: '+port);
});
