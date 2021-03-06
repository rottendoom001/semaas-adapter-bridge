﻿'use strict';

const NOTIFICATION_TYPE = 'MAIL';
const DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
const DATE_FORMAT = 'YYYY-MM-DD';
const DELIVERY_SCHEDULED_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
const CHARACTER_SEPARATOR = '^';
const COLON               = ':';



const APX_PARAMS = {
  HOST:'150.250.142.227',
  PORT:7050,
  PATH:'/APX_Runtime_Online/PGWebService',
  METHOD:'POST',
  TIMEOUT:4000
};

const MONGO_CONFIG = {
  HOST:'127.0.0.1',
  PORT:'27017',
  DB: 'connectors',
  COLLECTION: 'configuration'
}

const ERROR_TYPE = {
  CLIENT: 'CLIENT_ERROR',
  SERVER: 'SERVER_ERROR',
  EXTERNAL: 'EXTERNAL_ERROR'
};

const NOTIFICATION_STATE = {
  DISCARDED : 'DISCARDED',
  ACCEPTED  : 'ACCEPTED',
  REJECTED  : 'REJECTED',
  SCHEDULED : 'SCHEDULED',
  DELIVERED : 'DELIVERED',
  ERROR     : 'ERROR',
  INVALID   : 'INVALID'
};

const HTTP_CODE = {
  ACCEPTED: '201',
  CLIENT_ERROR: '400',
  SERVER_ERROR: '500',
  EXTERNAL_ERROR: '502',
  TIMEOUT: '504'
};

const CONNECTORS = {
  APX: 'streamapx'
};

exports.NOTIFICATION_TYPE = NOTIFICATION_TYPE;
exports.DATE_FORMAT = DATE_FORMAT;
exports.DATETIME_FORMAT = DATETIME_FORMAT;
exports.DELIVERY_SCHEDULED_TIME_FORMAT = DELIVERY_SCHEDULED_TIME_FORMAT;
exports.CHARACTER_SEPARATOR = CHARACTER_SEPARATOR;
exports.COLON = COLON;

exports.ERROR_TYPE = ERROR_TYPE;
exports.NOTIFICATION_STATE = NOTIFICATION_STATE;
exports.HTTP_CODE = HTTP_CODE;
exports.APX_PARAMS = APX_PARAMS;

exports.MONGO_CONFIG = MONGO_CONFIG;
exports.CONNECTORS = CONNECTORS;
