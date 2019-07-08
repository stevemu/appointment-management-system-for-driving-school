
// constants
const APP_CONSTANTS = {
    DB: "Metro",
    USERS: "Users",
    APPOINTMENTS: "Appointments",
    STUDENTS: "Students",
    CARS: "Cars",
    INSTRUCTORS: "Instructors"
};

// rethinkdb config
const defaultRethinkdbConfig = {
    host: "localhost",
    port: 28015,
    authKey: ""
};

// read rethinkdb config from env
const RETHINKDBHOST = process.env.RETHINKDBHOST || defaultRethinkdbConfig.host;
const RETHINKDBPORT = process.env.RETHINKDBPORT || defaultRethinkdbConfig.port;
const RETHINKDBAUTHKEY = process.env.RETHINKDBAUTHKEY || defaultRethinkdbConfig.authKey;

// find rethinkdb config
const rethinkdbConfig = {
    host: RETHINKDBHOST,
    port: RETHINKDBPORT,
    authKey: RETHINKDBAUTHKEY
};

const PORT = process.env.PORT || 4000;
const APP_SECRET = process.env.APP_SECRET || "ilovemetroschool";

module.exports = { rethinkdbConfig, APP_CONSTANTS, PORT, APP_SECRET };
