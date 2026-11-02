const authService = require("../services/auth.service");
async function handleRegisterUser(req, res, next) {
  const { email, password } = req.body;
  try {
    const { userId, token } = await authService.register({ email, password });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });
    res.status(201).json({
      userId: userId.toString(),
      message: "Registration successful",
    });
  } catch (error) {
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
    next(error);
  }
}
async function handleLoginUser(req, res, next) {
  const { email, password } = req.body;
  try {
    const token = await authService.login({ email, password });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });
    return res.status(200).json({
      message: "User Successfully logged in",
    });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ message: err.message });
    }
    next(err);
  }
}
module.exports = { handleRegisterUser, handleLoginUser };
