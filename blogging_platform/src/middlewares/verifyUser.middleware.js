const jwt = require("jsonwebtoken");

function verifyUser(req, res, next) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({
      message: "Please login first",
    });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    return next();
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "Session expired, please log in again"
        : "Invalid token";
    return res.status(401).json({ message });
  }
}
module.exports = verifyUser;
