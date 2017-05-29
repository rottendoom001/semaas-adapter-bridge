'use strict';

let express = require('express');
let app = express();

let osprey = require('osprey');
let path   = require('path');
let raml   = path.join(__dirname, 'rsc', 'adapter-bridge-api.raml');
let times  = require(path.join(__dirname, '/lib/times'));
let utils  = require(path.join(__dirname, '/lib/utils'));
let raml2html  = require(path.join(__dirname, '/lib/raml2html'));
let apxAdapter = require(path.join(__dirname, '/lib/apxAdapter'));
let idGenerator = require(path.join(__dirname, '/lib/idGenerator'));
let mongo       = require(path.join(__dirname, '/lib/mongodb'));


const ramlConfig = {
   "disableErrorInterception": true
 };

osprey.loadFile(raml, ramlConfig)
  .then(function (middleware) {
    console.log("//////// SERVER START IN PORT 3000/////////");
    app.use(middleware);
    app.use(function(err, req, res, next) {
      var response = {};
      var now = times.getCurrentTime();
      if (err) {
        var errors = [];
        var requestErrors = [];
        var e ;

        if (err.requestErrors) {
          e = err.requestErrors;
        } else {
          console.log(err);
          requestErrors.push({message : err.message});
          e = requestErrors;
        }

        for (var i = 0 ; i < e.length ; i ++){
          var error = {};
          error.code = (e[i].keyword) ? e[i].dataPath : 'clientError';
          var desc1 = (e[i].dataPath) ? e[i].dataPath + ' ' : '';
          var desc2 = (e[i].message) ? e[i].message : '';
          error.description = desc1 + desc2;
          errors.push(error);
        }

        response.id = idGenerator.generateId();
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
          res.send({});
        }
      });
    });

    app.post('/event', function(req, res){
      route(req, res);
    });

    app.listen(3000)
  })
  .catch(function(e) {
    console.error("ERROR : %s", e.message);
  });

function route(req, res){
  var id = req.body.stream;
  switch (id) {
    case utils.CONNECTORS.APX:
      getRouteOption(id, res, function(errorResponse, data){
        if(errorResponse){
          res.status(utils.HTTP_CODE.EXTERNAL_ERROR).send(errorResponse);
        } else {
          apxAdapterCore(req, res, data);
        }
      });
      break;
    default:
      console.log("ENTRA");
      var customError = new Error ();
      customError.message = "STREAM NOT SUPPORTED";
      res.status(utils.HTTP_CODE.CLIENT_ERROR).send(createSingleErrorResponse(utils.ERROR_TYPE.EXTERNAL, customError));
  }
}

function apxAdapterCore(req, httpRes, data){
  var now = times.getCurrentTime();
  var response = {};
  apxAdapter.sendPost(req.body, data, function(err,resp){
    if(err){
      response.id = idGenerator.generateId();
      response.transactionTime = now.format(utils.DATETIME_FORMAT);
      response.errors = resp.errors;
    }else{
      response.id = idGenerator.generateId();
      response.transactionTime = now.format(utils.DATETIME_FORMAT);
      console.log(response);
    }
    httpRes.status(resp.status).send(response);
  });
}


function getRouteOption(id, res, callback){
  mongo.connect(utils.MONGO_CONFIG.HOST,utils.MONGO_CONFIG.PORT, utils.MONGO_CONFIG.DB, function(errConn, dbConn){
    if (errConn){
      console.error(errConn);
      callback(createSingleErrorResponse(utils.ERROR_TYPE.EXTERNAL,errConn));
    } else {
      mongo.getItemByIndex(dbConn, utils.MONGO_CONFIG.COLLECTION, id, function(getErr, data){
        if (getErr){
          console.error(errConn);
          callback(createSingleErrorResponse(utils.ERROR_TYPE.EXTERNAL, getErr));
        } else {
          if (!data) {
            var customError = new Error ();
            customError.message = "NO CONFIGURATION FOUND";
            callback(createSingleErrorResponse(utils.ERROR_TYPE.EXTERNAL, customError));
          } else {
            callback(null, data);
          }
        }
      });
    }
  });
}

function createSingleErrorResponse (errorCode, err){
  var error = {};
  var now = times.getCurrentTime();
  var errorResponse = {
    id : idGenerator.generateId(),
    transactionTime : now.format(utils.DATETIME_FORMAT),
    errors : []
  }
  error.errorCode = errorCode;
  error.description = JSON.stringify(err);

  errorResponse.errors.push(error);
  return errorResponse;
}
