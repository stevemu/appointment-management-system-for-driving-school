let moment = require("moment/moment");
let momentz = require("moment-timezone");
const jwt = require('jsonwebtoken');

function getUserId(token, secret) {
  const { userId } = jwt.verify(token, secret);
  return userId
}

// student

function convertDateFieldsInStudentToHumanReadable(item) {

  if (!item) return item;

  item = {
    ...item,
    dob: item.dob ? moment(item.dob).format("L") : '',
    firstDay: item.firstDay ? moment(item.firstDay).format("L") : '',
    learnerPermitExp: item.learnerPermitExp ? moment(item.learnerPermitExp).format("L") : '',
  };

  return item;
}

function validateDateFieldsInStudent(input) {

  var dateReg = /^\d{2}([./-])\d{2}\1\d{4}$/

  let validated = true;

  // date fields: dob, firstDay, learnerPermitExp
  if (input.dob && !input.dob.match(dateReg)) {
    validated = false;
  }
  if (input.firstDay && !input.firstDay.match(dateReg)) {
    validated = false;
  }
  if (input.learnerPermitExp && !input.learnerPermitExp.match(dateReg)) {
    validated = false;
  }

  return validated;
}

function convertDateFieldsInStudentInputToRethinkdbFormat(r, input) {
  // console.log(input);

  input = {
    ...input,
    firstDay: input.firstDay ?
      r.ISO8601(moment(input.firstDay, "L").utc().format()) :
      r.ISO8601(moment().utc().format()),
    dob: input.dob ? r.ISO8601(moment(input.dob, "L").utc().format()) : '',
    learnerPermitExp: input.learnerPermitExp ?
      r.ISO8601(moment(input.learnerPermitExp, "L").utc().format()) : ''
  };
  return input;
}

// convert to uppercase
function sanitizeFieldsInStudentInput(input) {
  // console.log(input);
  input = {
    ...input,
    name: input.name ? input.name.toUpperCase() : '',
    learnerPermitNo: input.learnerPermitNo ? input.learnerPermitNo.toUpperCase() : '',
    address: input.address ? input.address.toUpperCase() : ''
  };
  return input;
}

// appointment

function convertDateFieldsInAppointmentToHumanReadable(item) {

  // bug: if user is not in the same timezone as the server is in,
  // the date will be off
  item = {
    ...item,
    date: moment(item.startTime).utcOffset("-04:00").format("L"),
    time: moment(item.startTime).utcOffset("-04:00").format("LT"),
  };
  // console.log(item);

  return item;
}

function convertDateTimeToRDate(date, time, timezoneOffset, r) {
  let dateTime = date + " " + time + " " + timezoneOffset;
  let m = moment.utc(dateTime, "MM/DD/YYYY h:mm a Z", true);
  if (!m.isValid()) {
    throw "Invalid date: " + dateTime
  }
  return r.ISO8601(m.utc().format());
}

module.exports = {
  getUserId,
  convertDateFieldsInStudentToHumanReadable,
  convertDateFieldsInAppointmentToHumanReadable,
  convertDateFieldsInStudentInputToRethinkdbFormat,
  sanitizeFieldsInStudentInput,
  convertDateTimeToRDate,
  validateDateFieldsInStudent
};