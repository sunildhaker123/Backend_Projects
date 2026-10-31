const userModel = require("../models/user.model");

// this function is guaranteeing to return the object id
async function registerUser({ email, password_hash }) {
  const user = await userModel.create({
    email: email,
    password_hash: password_hash,
  });
  return user._id;
}

async function findUserByEmail(email) {
  const user = await userModel.findOne({ email: email });
  return user;
}
findUserByEmail();
module.exports = { registerUser, findUserByEmail };
