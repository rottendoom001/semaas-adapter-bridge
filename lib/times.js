'use strict';

let moment    = require('moment');
require('moment-round');
require('moment-timezone');

const MINUTES = 30;

function getCurrentTime() {
  return moment().utc();
}

function convertDateTime(value) {
  return value ? moment.parseZone(value) : undefined;
}

function convertDateTimeZone(value, timeZone) {
  return value.tz(timeZone);
}

function obtainDeliveryTime(dateTime) {
  return dateTime.ceil(MINUTES, 'minutes');
}

function createDateTimeZone(dateTimeValues, timeZone) {
  return moment.tz(dateTimeValues, timeZone);
}

exports.getCurrentTime = getCurrentTime;
exports.convertDateTime = convertDateTime;
exports.convertDateTimeZone = convertDateTimeZone;
exports.obtainDeliveryTime = obtainDeliveryTime;
exports.createDateTimeZone = createDateTimeZone;
exports.MINUTES = MINUTES;
