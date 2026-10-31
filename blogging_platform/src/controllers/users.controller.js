const {
  registerUser,
  findUserByEmail,
} = require("../repositories/user.repository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
async function handleRegisterUser(req, res, next) {
  const body = req.body;
  console.log(body);

  const { email, password } = req.body;
  console.log(req.body);

  try {
    const password_hash = await bcrypt.hash(password, 12);
    const userId = await registerUser({ email, password_hash });
    const token = jwt.sign({ sub: userId.toString() }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 1000,
    });
    res.cookie("token", token);
    res.status(201).json({
      userId: userId.toString(),
      message: "Registration successful",
      token: token,
    });
  } catch (error) {
    console.error("Registration failed:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        error: "Conflict",
        message: "This email address is already registered.",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Bad Request",
        message: error.message,
      });
    }
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred on our end.",
    });
  }
}
async function handleLoginUser(req, res) {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        error: "Not Found",
        message: "The requested user profile does not exist.",
      });
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({
        error: "unauthorised",
        message: "Email or Password is incorrect",
      });
    }
    const token = jwt.sign(
      { sub: user._id.toString() },
      process.env.JWT_SECRET,
      {
        expiresIn: 60 * 60 * 1000,
      },
    );
    res.cookie("token", token);
    return res.status(200).json({
      message: "User Successfully logged in",
    });
  } catch (error) {
    next(error);
  }
}
module.exports = { handleRegisterUser, handleLoginUser };
