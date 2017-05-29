'use strict';
let raml2html = require('raml2html');
let configWithDefaultTheme = raml2html.getConfigForTheme();


// source can either be a filename, url, or parsed RAML object
function getHtmlRaml(raml, callback){
  var response = {};
  raml2html.render(raml, configWithDefaultTheme).then(function(result) {
    response.status = "OK";
    response.data = result;
    callback(response);
  }, function(error) {
    console.error(error);
    response.status = "ERROR";
    response.error = error.message;
    callback(response);
  });
}

exports.getHtmlRaml = getHtmlRaml;
