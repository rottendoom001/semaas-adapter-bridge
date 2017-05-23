'use strict';
let mustache = require('mustache');
let soap     = require('soap');
let http     = require('http');
let path     = require('path');
let utils    = require(path.join(__dirname, './utils'));

function loadTemplate(req) {
    var jsonData = JSON.parse(new Buffer(req.body, 'base64').toString('utf8'));
    var apxListValues = buildListValues(jsonData.data);
    var template = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:com=\"http://common.apx.pg.otma.domain.integration.elara.bbva.com\" xmlns:req=\"http://request.apx.pg.otma.domain.integration.elara.bbva.com\" xmlns:ws=\"http://ws.protocol.physical.integration.elara.bbva.com/\"><soapenv:Header /><soapenv:Body><ws:serviceOtmaPGApxXml><!--Optional:--><ws:arg0><req:body><req:simpleFieldList>{{{simpleFieldListValues}}}</req:simpleFieldList></req:body><!--Optional:--><req:extendedHeader><!--Optional:--><req:accountingTerminal /><!--Optional:--><req:logicalTerminal /><!--Optional:--><req:sequenceID /></req:extendedHeader><req:header><req:authorizationCode>1234</req:authorizationCode><req:authorizationVersion>1</req:authorizationVersion><req:branchCode>0800</req:branchCode><req:channelCode>70</req:channelCode><req:clientDocument>1</req:clientDocument><req:clientIdentificationType>1</req:clientIdentificationType><req:contactIdentifier>1</req:contactIdentifier><req:countryCode>MX</req:countryCode><req:currencyCode>EUR</req:currencyCode><req:entityCode>0182</req:entityCode><req:environCode>01</req:environCode><req:headerName>QP05</req:headerName><req:ipAddress>1234</req:ipAddress><req:languageCode>ES</req:languageCode><req:logicalTransactionCode>{{transaction}}</req:logicalTransactionCode><req:operationDate>20110922</req:operationDate><req:operationTime>115900</req:operationTime><req:operativeBranchCode>3994</req:operativeBranchCode><req:operativeEntityCode>0182</req:operativeEntityCode><req:productCode>0001</req:productCode><req:requestId>1</req:requestId><req:secondaryCurrencyCode>EUR</req:secondaryCurrencyCode><req:serviceId>?</req:serviceId><req:subtypeCode>01</req:subtypeCode><req:typeCode>01</req:typeCode><req:userCode>CPBAS105</req:userCode><req:versionCode>01</req:versionCode><req:workstationCode>abcd</req:workstationCode></req:header></ws:arg0></ws:serviceOtmaPGApxXml></soapenv:Body></soapenv:Envelope>";
    mustache.parse(template);
    return mustache.render(template, {
        transaction: "KJJQT060",
        simpleFieldListValues: apxListValues
    });
}


function buildListValues(data) {
    if (data == null) {
        return;
    }
    var listValues = "";
    Object.keys(data).forEach(function(key) {
        var name    = "<com:name>" + key + "</com:name>";
        var value   = "<com:value>" + data[key] + "</com:value>";
        listValues += "<com:simpleFieldType>" + name + value + "</com:simpleFieldType>"
    });
    return listValues;
}

function sendPost(req, callback) {
    var response = {};
    var isTimedOut;
    var body = loadTemplate(req);
    var postRequest = {
        host: utils.APX_PARAMS.HOST,
        path: utils.APX_PARAMS.PATH,
        port: utils.APX_PARAMS.PORT,
        method: utils.APX_PARAMS.METHOD,
        headers: {
            'Content-Type': 'text/xml',
            'Content-Length': Buffer.byteLength(body)
        }
    };
    setTimeout(function() {
        isTimedOut = true;
        response.status = utils.HTTP_CODE.TIMEOUT;
        response.errors = {"code":"timeout","description":"The server did not receive a timely response"};
        callback(new Error("Connection timed out"),response);
        return;
    }, utils.APX_PARAMS.TIMEOUT);
    var req = http.request(postRequest, function(res) {
        var bufferData ="";
        if (isTimedOut) 
            callback();
        res.on("data", function(data) {
            bufferData +=  data;
            response.status = utils.HTTP_CODE.ACCEPTED;
        });
        res.on("end", function(data) {
            response.data =  bufferData;
            console.log("Apx_response --> ", response.data)
            callback(null, response);
        });

    });
    req.on('error', function(e) {
        console.log('Problem with request: ' + e.message);
        response.status = utils.HTTP_CODE.SERVER_ERROR;
        response.errors = {"code":"internal_error","description":"The server encountered an unexpected condition"};
        callback(new Error("Problem with request"),response);
    });
    req.write(body);
    req.end();
}

exports.sendPost = sendPost;