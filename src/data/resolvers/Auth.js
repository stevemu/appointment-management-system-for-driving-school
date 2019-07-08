const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
let {APP_CONSTANTS} = require( '../../config');
let {USERS, DB} = APP_CONSTANTS;

const login = async (parent, { username, password }, { r, secret }) => {

  console.log('login attempt at ' + new Date());
  console.log(username);
  console.log(password);
  let users = await r.db(DB).table(USERS).filter({username});

  let user = users[0];

  let loginError = new Error("login failed.");
  if (!user) {
    console.error('user not found');
    throw loginError;
  }

  const valid = await bcrypt.compareSync(password, user.password);
  if (!valid) {
    console.error('password is not correct');
    throw loginError;
  }

  let token = jwt.sign({ userId: user.id }, secret);

  return {
    token,
    user,
  }
}


module.exports = {
  Mutation: {
    login
  }
}