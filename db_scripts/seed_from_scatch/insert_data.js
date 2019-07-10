let fs = require("fs");
const uuid = require('uuid/v4');
let r = require("rethinkdbdash")({ servers: [{ host: "localhost", port: 28015 }] });
let moment = require("moment");

//todo: read db name from command line argument
let db = "Metro"

async function run() {

    // users
    await r.db(db).table("Users").delete();
    await r.db(db).table("Users").insert({
        "password": "$2a$10$WB7SIpWfGtvF6ULO6B0MFe.SaZCBVuU9PgkVSz38oFNseG7m/fEEa", //"demo"
        "username": "admin"
    })

    // instructors
    await r.db(db).table("Instructors").delete();
    await r.db(db).table("Instructors").insert({
        "id": "Mendy_Haythornthwaite",
        "name": "Mendy Haythornthwaite"
    })
    await r.db(db).table("Instructors").insert({
        "id": "Chlo_Sheilds",
        "name": "Chlo Sheilds"
    })

    // cars
    await r.db(db).table("Cars").delete();
    await r.db(db).table("Cars").insert({
        "id": "EZ1001",
        "no": "EZ1001"
    })
    await r.db(db).table("Cars").insert({
        "id": "EZ1002",
        "no": "EZ1002"
    })

    // students
    await r.db(db).table("Students").delete();
    await r.db(db).table("Students").insert({
        "address": "111 Fun St, Quincy, MA",
        "dob": r.ISO8601("2000-07-10T12:00:00Z"),
        "firstDay": r.ISO8601("2019-07-01T12:00:00Z"),
        gender: "M",
        learnerPermitNo: "S123123123",
        name: "Kaycee Byram",
        zip: "02170",
        phone: "111-222-3333"
    })
    await r.db(db).table("Students").insert({
        id: "6cd8788b-9f8d-4eb6-bcd9-ef769fe4d407",
        "address": "77 Hollow Ridge Pass, MA",
        "dob": r.ISO8601("1993-07-10T12:00:00Z"),
        "firstDay": r.ISO8601("2007-07-01T12:00:00Z"),
        gender: "M",
        learnerPermitNo: "S123123123",
        name: "Adara Rupert",
        zip: "02170",
        phone: "555-555-5555"
    })

    // appointments
    await r.db(db).table("Appointments").delete();
    await r.db(db).table("Appointments").insert({
        "carId":  "EZ1002" ,
        "classType":  "One Class" ,
        "id":  "45f959a2-6c25-4e9e-939e-3f86391db606" ,
        "instructorId":  "Chlo_Sheilds" ,
        "note":  "" ,
        "startTime": r.ISO8601("2019-07-10T12:00:00Z"),
        "studentId":  "6cd8788b-9f8d-4eb6-bcd9-ef769fe4d407"
    })

    process.exit();
}

run().then().catch((err) => {
    console.log(err);
})