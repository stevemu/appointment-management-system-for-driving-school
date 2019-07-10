let fs = require("fs");
const uuid = require('uuid/v4');
let r = require("rethinkdbdash")({ servers: [{ host: "localhost", port: 28015 }] });
let moment = require("moment");

//todo: read db name from command line argument
let db = "Metro"

async function run() {

  // create db
  try {
    await r.dbDrop(db);
    await r.dbCreate(db);

  } catch (error) {
    console.log('db already exist');
  }

  // create tables

  try {
    await r.db(db).tableCreate("Appointments");
    await r.db(db).table("Appointments").indexCreate("startDate")
    await r.db(db).table("Appointments").indexCreate("startTime")
    await r.db(db).tableCreate("Cars");
    await r.db(db).tableCreate("Instructors");
    await r.db(db).tableCreate("Students");
    await r.db(db).table("Students").indexCreate("firstDay")
    await r.db(db).table("Students").indexCreate("name")
    await r.db(db).tableCreate("Users");

  } catch (error) {
    console.log('Err creating tables, some tables may already exists');
  }


  process.exit();
}

run().then().catch((err) => {
  console.log(err);
})