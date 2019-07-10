var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

//hash
var hash = bcrypt.hashSync("demo", salt);

console.log(hash);

// check
console.log(bcrypt.compareSync("metrorocks!!!", hash))


// const bcrypt = require('bcryptjs');

// async function run() {

//   let hashed = bcrypt.hashSync("UPN32I9a@", 8);
//   console.log(hashed); 

//   // $2a$08$sgxXRhZTW6SwZCHk3ae8/On3p9pslAe0y1U5ydjFWG9GxOnF1eKXS

//   let isValid = bcrypt.compareSync("UPN32I9a@", hashed);
//   console.log(isValid);

//   process.exit();
// }

// run().then().catch((err) => {
//   console.log(err);
// })