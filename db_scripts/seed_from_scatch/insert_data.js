let fs = require("fs");
const uuid = require('uuid/v4');
let r = require("rethinkdbdash")({ servers: [{ host: "localhost", port: 28015 }] });
let moment = require("moment");

//todo: read db name from command line argument
let db = "Metro"

async function run() {

    // users
    await r.db(db).table("Users").insert({
        "password": "$2a$10$WB7SIpWfGtvF6ULO6B0MFe.SaZCBVuU9PgkVSz38oFNseG7m/fEEa", //"demo"
        "username": "admin"
    })


    process.exit();
}

run().then().catch((err) => {
    console.log(err);
})