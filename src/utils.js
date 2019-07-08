let moment = require("moment/moment");
let momentz  = require("moment-timezone");
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
    dob: moment(item.dob).format("L"),
    firstDay: moment(item.firstDay).format("L"),
    learnerPermitExp: moment(item.learnerPermitExp).format("L"),
  };

  return item;
}

function convertDateFieldsInStudentInputToRethinkdbFormat(r, input) {
  input = {
    ...input,
    firstDay: r.ISO8601(moment(input.firstDay, "L").utc().format()),
    dob: r.ISO8601(moment(input.dob, "L").utc().format()),
    learnerPermitExp: r.ISO8601(moment(input.learnerPermitExp, "L").utc().format())
  };
  return input;
}

// convert to uppercase
function sanitizeFieldsInStudentInput(input) {
  input = {
    ...input,
    name: input.name.toUpperCase(),
    learnerPermitNo: input.learnerPermitNo.toUpperCase(),
    addresss: input.addresss.toUpperCase()
  };
  return input;
}

// appointment

function convertDateFieldsInAppointmentToHumanReadable(item) {

  item = {
    ...item,
    date: moment(item.startTime).format("L"),
    time: moment(item.startTime).format("LT"),
  };

  return item;
}

function convertDateTimeToRDate (date, time, r) {

  // calculate the startTime
  let mDate = momentz.tz(date, "L", "America/New_York");
  let mTime = momentz.tz(time, "LT", "America/New_York");

  // update the mDate with times
  mDate.hour(mTime.hour());
  mDate.minute(mTime.minute());

  return r.ISO8601(mDate.utc().format());
}



module.exports = {
  getUserId,
  convertDateFieldsInStudentToHumanReadable,
  convertDateFieldsInAppointmentToHumanReadable,
  convertDateFieldsInStudentInputToRethinkdbFormat,
  sanitizeFieldsInStudentInput,
  convertDateTimeToRDate
};