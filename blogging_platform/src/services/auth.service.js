const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  registerUser,
  findUserByEmail,
} = require("../repositories/user.repository");

class AuthError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function register({ email, password }) {
  const password_hash = await bcrypt.hash(password, 12);
  const userId = await registerUser({ email, password_hash });
  const token = jwt.sign({ sub: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: 60 * 60,
  });
  return { userId: userId._id.toString(), token: token };
}
async function login({ email, password }) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new AuthError(401, "Invalid email or password");
  }
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    throw new AuthError(401, "Invalid email or password");
  }
  const token = jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: 60 * 60,
    v,
  });
  return token;
}
module.exports = { register, login };
