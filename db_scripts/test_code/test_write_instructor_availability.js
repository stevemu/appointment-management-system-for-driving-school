let fs = require("fs");
const uuid = require('uuid/v4');
let r = require("rethinkdbdash")({servers: [{host: "localhost", port: 28015}]});
let moment = require("moment");


async function run() {


  // console.log('deleting appointments table');
  let result = await r.db("Metro").table("Instructors").get("Ann").update({
    availability: {
      0: [["9:00 AM", "11:00 AM"]]
    }
  });

  console.log(result);

  process.exit();
}


run().then().catch((err) => {
  console.log(err);
})