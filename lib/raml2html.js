let raml2html = require('raml2html');
let configWithDefaultTheme = raml2html.getConfigForTheme();

let raml   = path.join(__dirname,'../rsc/adapter-bridge-api.raml');

// source can either be a filename, url, or parsed RAML object
function getHtmlRaml(callback){
  var result = {status : "OK"};
  raml2html.render(raml, configWithDefaultTheme).then(function(result) {
    result.data = result;
    callback(result);
  }, function(error) {
    result.status = "ERROR";
    result.error = error;
    callback(result);
  });
}

exports.getHtmlRaml = getHtmlRaml;
