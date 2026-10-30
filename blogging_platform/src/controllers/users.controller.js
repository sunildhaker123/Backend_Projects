const { registerUser } = require("../repositories/user.repository");
const bcrypt = require("bcrypt");
async function handleRegisterUser(req, res, next) {
  const body = req.body;
  console.log(body);

  const { email, password } = req.body;
  console.log(req.body);
  //here also implement validation dont just solely rely on database checks

  try {
    const password_hash = await bcrypt.hash(password, 12);
    const userId = await registerUser({ email, password_hash });
    res.status(201).json({
      userId: userId,
      message: "Registration successful",
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
module.exports = { handleRegisterUser };
