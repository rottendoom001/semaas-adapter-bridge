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

const ramlConfig = {
   "disableErrorInterception": true
 };

osprey.loadFile(raml, ramlConfig)
  .then(function (middleware) {
    var response = {};
    var now = times.getCurrentTime();
    console.log("//////// SERVER START IN PORT 3000/////////");
    app.use(middleware);
    app.use(function(err, req, res, next) {
      if (err) {
        var errors = [];
        var e = err.requestErrors;
        for (var i = 0 ; i < e.length ; i ++){
          var error = {};
          error.code = e[i].keyword;
          var desc1 = (e[i].dataPath) ? e[i].dataPath : '';
          var desc2 = (e[i].message) ? e[i].message : '';
          error.description = desc1 + " " + desc2;
          errors.push(error);
        }
        response.id = (req.body.id) ? req.body.id : 'undefined';
        response.transactionTime = now.format(utils.DATETIME_FORMAT);
        response.errors = errors;
        res.status(utils.HTTP_CODE.CLIENT_ERROR).send(response);
      } else {
        next();
      }
    });

    app.get('/', function(req, res){
      raml2html.getHtmlRaml(raml, function(resHtml){
        if(resHtml.status === "OK"){
          res.send(resHtml.data);
        } else {
          res.send(response);
        }
      });
    });
    app.post('/event', function(req, res){
      apxAdapter.sendPost(req.body, function(err,resp){
            if(err){
              response.id = req.body.id;
              response.transactionTime = now.format(utils.DATETIME_FORMAT);
              response.errors = resp.errors;
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
