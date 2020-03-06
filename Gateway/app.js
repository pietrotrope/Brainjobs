const express = require('express')
var cors = require('cors')
const request = require('request');
var bodyParser = require('body-parser');
const config = require('./configuration');
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const Port = config.port;
const Backend_ip = config.ip;
const Backend_port = config.backend_port;
const Backend_address = "http://"+Backend_ip+":"+Backend_port;


function manage_request(type, request_to_manage, resp){
  var status = 500;
  var func = (err, res, body) => {
    status=res.statusCode;
    resp.status(status);
    switch(status){
      case  200: resp.json(JSON.parse(body)); break;
      case 201: resp.json(body); break;
      default : resp.send(""); break;
    }
  };
  switch(type){
    case "POST": request.post(request_to_manage, func); break;
    case "GET": request.get(request_to_manage, func); break;
  }
}


app.post('/user/login', function (req, resp){
  var request_to_manage = {url: Backend_address+'/user/login', form: {bj_user: req.body.bj_user, bj_pwd: req.body.bj_pwd}};
  manage_request("POST",request_to_manage, resp);
});


app.post('/jobs', function (req, resp){
  var parameters = {title: req.body.title, language: req.body.language, framework: req.body.framework, dataset: req.body.dataset, dataset_datatype: req.body.dataset_datatype, model: req.body.model};
  var request_to_manage = {headers:{ authorization: req.headers.authorization}, url: Backend_address+'/jobs', form: parameters};
  manage_request("POST",request_to_manage, resp);
});


app.get('/jobs', function (req, resp){
  var request_to_manage = {headers:{ authorization: req.headers.authorization},url: Backend_address+'/jobs'};
  manage_request("GET",request_to_manage, resp);
});


app.get('/jobs/:job_id', function (req, resp){
  var id = req.params.job_id;
  var request_to_manage = {headers:{ authorization: req.headers.authorization},url: Backend_address+'/jobs/'+id, form:{job_id: id}}
  manage_request("GET",request_to_manage, resp);
});


app.listen(Port, () => {
  console.log('Gateway running on port: '+Port)
});
