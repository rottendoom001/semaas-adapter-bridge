'use strict';


let express = require('express');
let app = express();

let osprey = require('osprey');
let path   = require('path');
let raml   = path.join(__dirname, 'rsc', 'adapter-bridge-api.raml');
let times  = require(path.join(__dirname, '/lib/times'));
let utils  = require(path.join(__dirname, '/lib/utils'));
let raml2html  = require(path.join(__dirname, '/lib/raml2html'));
let apxAdapter = require(path.join(__dirname, 'lib/apxAdapter'));


osprey.loadFile(raml)
  .then(function (middleware) {
    console.log("//////// SERVER START IN PORT 3000/////////");
    app.use(middleware)

    app.get('/', function(req, res){
      var response = {status: "OK"};
      raml2html.getHtmlRaml(raml, function(resHtml){
        if(resHtml.status === "OK"){
          res.send(resHtml.data);
        } else {
          res.send(response);
        }
      });
    });
    app.post('/event', function(req, res){
      var response = {};
      var now = times.getCurrentTime();

      apxAdapter.sendPost(req.body, function(err,resp){
            if(err){
              response.error = "Error sending apxPost";
              response.transactionTime = now.format(utils.DATETIME_FORMAT);
            }else{
              response.id = req.body.id;
              response.transactionTime = now.format(utils.DATETIME_FORMAT);
              console.log(response);
            } 
            res.status(resp.status).send(response);
      });
    });
    app.listen(3000)
  })
  .catch(function(e) {
    console.error("ERROR : %s", e.message);
  });
