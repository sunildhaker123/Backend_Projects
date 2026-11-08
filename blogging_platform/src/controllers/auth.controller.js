const authService = require("../services/auth.service");
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");
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
async function handleLogOut(req, res, next) {
  try {
    const token = req.cookies?.token;
    console.log(token);
    if (token) {
      const decoded = jwt.decode(token);
      if (decoded && decoded.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        const timeRemaining = decoded.exp - currentTime;
        if (timeRemaining > 0) {
          await redisClient.set(`bl_${token}`, "myvalue", "EX", timeRemaining);
        }
      }
    }
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
    });
    return res.status(200).json({ message: "Logged out completely." });
  } catch (error) {
    console.error("Logout Error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error.Couldnt logout" });
  }
}
module.exports = { handleRegisterUser, handleLoginUser, handleLogOut };
