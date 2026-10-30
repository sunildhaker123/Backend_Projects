const userModel = require("../models/user.model");

// this function is guaranteeing to return the object id
async function registerUser({ email, password_hash }) {
  const user = await userModel.create({
    email: email,
    password_hash: password_hash,
  });
  return user._id;
}
module.exports = { registerUser };
