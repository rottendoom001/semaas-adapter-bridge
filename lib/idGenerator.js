'use strict';

var shortid = require('shortid');
let path   = require('path');
let times  = require(path.join(__dirname, 'times'));

function generateId() {
  return times.getCurrentTime() + '-' + shortid.generate();
}

exports.generateId = generateId;
