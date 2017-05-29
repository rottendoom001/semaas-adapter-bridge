'use strict';
var MongoClient = require('mongodb').MongoClient;

// URL FORMAT : localhost:27017/exampleDb
function connect(host, port, db, callback){
  var url = "mongodb://" + host + ":" + port + "/" + db;
  MongoClient.connect(url, function(err, db) {
    if (err){
      callback(err);
    } else {
      callback(null, db);
    }
  });
}

function getItemByIndex(db, collectionName, id, callback){
  var collection = db.collection(collectionName);
  collection.findOne({id: id}, function(err, item) {
    if (err){
      callback(err);
    } else {
      callback(null, item);
    }
  });
}

exports.connect = connect;
exports.getItemByIndex = getItemByIndex;
